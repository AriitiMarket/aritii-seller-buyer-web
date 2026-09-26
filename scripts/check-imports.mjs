#!/usr/bin/env node
/**
 * check-imports.mjs — import/export path integrity checker for this frontend.
 *
 * Run from the repo root:   node scripts/check-imports.mjs
 *
 * Reports, with no dependencies and no build step:
 *   1. unresolved local specifiers (what `vite build` would fail on)
 *   2. leftover pre-restructure paths (@/features/*, @/pages/*, @/routes/*, @/context/*,
 *      @/config, @/utils/*, @/hooks/*, @/types/*)
 *   3. self-imports (a module importing itself -> infinite render)
 *   4. external packages that are not declared in package.json
 *   5. reachability from src/main.jsx and the modules that nothing imports
 *
 * Exit code 1 when unresolved specifiers or leftovers exist, so it can gate CI.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'src')
const EXTS = ['.js', '.jsx', '.mjs', '.json', '.css', '.scss', '.svg', '.png', '.jpg', '.jpeg']

const STALE = [
  [/^@\/features\//, 'pre-restructure "feature folder" path'],
  [/^@\/pages\//, 'pre-restructure "src/pages/**" path'],
  [/^@\/features$/, 'pre-restructure "feature folder" path'],
  [/^@\/routes\//, 'moved to @/app/routes/'],
  [/^@\/context\//, 'moved to @/app/providers/'],
  [/^@\/utils\//, 'moved to @/shared/utils/'],
  [/^@\/types\//, 'moved to @/shared/types/'],
  [/^@\/hooks\//, 'moved to @/shared/hooks/'],
  [/^@\/config(\/|$)/, 'moved to @/app/config'],
]

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out); else out.push(p)
  }
  return out
}
function resolveSpec(spec, fromFile) {
  const base = spec.startsWith('@/')
    ? path.join(SRC, spec.slice(2))
    : (spec.startsWith('.') ? path.resolve(path.dirname(fromFile), spec) : null)
  if (!base) return null
  for (const c of [base, ...EXTS.map((e) => base + e)]) {
    try { if (fs.statSync(c).isFile()) return c } catch {}
  }
  try {
    if (fs.statSync(base).isDirectory()) {
      for (const e of EXTS) { const i = path.join(base, 'index' + e); if (fs.existsSync(i)) return i }
    }
  } catch {}
  return null
}

const IMPORT_RE = /(?:^|[^\w$])import\s+(?:([\s\S]*?)\sfrom\s+)?['"]([^'"]+)['"]/gm
const EXPORT_RE = /(?:^|[^\w$])export\s+([\s\S]*?)\sfrom\s+['"]([^'"]+)['"]/gm
const DYN_RE = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/gm

const codeFiles = walk(SRC).filter((f) => /\.(jsx?|mjs)$/.test(f))
const rel = (p) => path.relative(ROOT, p)
const graph = new Map()
const unresolved = []
const stale = []
const selfImports = []
const nameCollisions = []
const externals = new Set()

for (const file of codeFiles) {
  const src = fs.readFileSync(file, 'utf8')
  const deps = new Set()
  const record = (spec, index) => {
    const lineStart = src.lastIndexOf('\n', index) + 1
    const lineEnd = src.indexOf('\n', index)
    const line = src.slice(lineStart, lineEnd === -1 ? src.length : lineEnd)
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return // inside a comment
    const lineNo = src.slice(0, index).split('\n').length
    if (!spec.startsWith('@/') && !spec.startsWith('.')) { externals.add(spec); return }
    const resolved = resolveSpec(spec, file)
    if (resolved) {
      if (resolved === file) selfImports.push({ file, spec, line: lineNo, note: 'module imports itself' })
      deps.add(resolved)
    } else {
      unresolved.push({ file, spec, line: lineNo })
      // A name collision is not proof of a self-import: flag it for review. The two real
      // self-imports in this repo look exactly like this (pages/Checkout.jsx importing
      // .../Checkout), as do two harmless coincidences (ProductDetail, useAuth).
      const a = path.basename(spec).replace(/\.(jsx?|mjs)$/, '')
      const b = path.basename(file).replace(/\.(jsx?|mjs)$/, '')
      if (a && a === b) nameCollisions.push({ file, spec, line: lineNo })
    }
    for (const [re, why] of STALE) if (re.test(spec)) stale.push({ file, spec, line: lineNo, why })
  }
  for (const re of [IMPORT_RE, EXPORT_RE, DYN_RE]) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(src))) {
      const spec = m[2] && m[1] !== undefined ? m[2] : m[1]
      if (!spec) continue
      record(spec, m.index)
    }
  }
  graph.set(file, deps)
}

// reachability from the entry point
const entry = path.join(SRC, 'main.jsx')
const seen = new Set()
const stack = [entry]
while (stack.length) {
  const f = stack.pop()
  if (seen.has(f)) continue
  seen.add(f)
  for (const d of graph.get(f) || []) if (!seen.has(d)) stack.push(d)
}
const unreachable = codeFiles.filter((f) => !seen.has(f))
const noImporter = codeFiles.filter(
  (f) => f !== entry && ![...graph.values()].some((s) => s.has(f)),
)

const declared = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const deps = new Set([...Object.keys(declared.dependencies || {}), ...Object.keys(declared.devDependencies || {})])
const undeclared = [...externals]
  .map((s) => (s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0]))
  .filter((p) => p && !p.startsWith('node:') && !deps.has(p) && !p.startsWith('.'))

const print = (title, rows, fmt) => {
  console.log(`\n${title}: ${rows.length}`)
  for (const r of rows) console.log('   ' + fmt(r))
}

console.log(`check-imports  root=${rel(ROOT) || '.'}  files=${codeFiles.length}`)

// Split by reachability: an unresolved import in a module the app never loads is dead code,
// not a build blocker (e.g. unregistered route scaffolding).
const reachable = (r) => seen.has(r.file)
const blockers = unresolved.filter(reachable)
const deadUnresolved = unresolved.filter((r) => !reachable(r))
const staleBlockers = stale.filter(reachable)
const staleDead = stale.filter((r) => !reachable(r))
const selfBlockers = selfImports.filter(reachable)

print('UNRESOLVED SPECIFIERS — BUILD BLOCKERS', blockers, (r) => `${rel(r.file)}:${r.line}  ${r.spec}`)
print('STALE PRE-RESTRUCTURE PATHS — BUILD BLOCKERS', staleBlockers, (r) => `${rel(r.file)}:${r.line}  ${r.spec}  -> ${r.why}`)
print('SELF-IMPORTS (definite — module resolves to itself)', selfBlockers, (r) => `${rel(r.file)}:${r.line}  ${r.spec}  (${r.note})`)
print('NAME COLLISIONS (review — unresolved target has this file\'s own name)', nameCollisions, (r) => `${rel(r.file)}:${r.line}  ${r.spec}`)
print('UNDECLARED EXTERNAL PACKAGES', [...new Set(undeclared)], (p) => p)
console.log(`\nREACHABLE FROM src/main.jsx: ${seen.size}/${codeFiles.length}`)
print('WARNINGS — UNRESOLVED IN UNREACHABLE MODULES (dead code, not build blockers)', deadUnresolved, (r) => `${rel(r.file)}:${r.line}  ${r.spec}`)
print('WARNINGS — STALE PATHS IN UNREACHABLE MODULES', staleDead, (r) => `${rel(r.file)}:${r.line}  ${r.spec}`)
print('UNREACHABLE MODULES', unreachable, (f) => rel(f))
print('MODULES NOTHING IMPORTS', noImporter, (f) => rel(f))

const blocking = blockers.length + staleBlockers.length + selfBlockers.length + undeclared.length
console.log(
  blocking === 0
    ? `\nOK — 0 build blockers (${deadUnresolved.length + staleDead.length} warning(s) in unreachable modules).`
    : `\nFAIL — ${blocking} build blocker(s). See docs/IMPORT_PATH_FIXES.md for the exact strings to write.`,
)
process.exit(blocking === 0 ? 0 : 1)
