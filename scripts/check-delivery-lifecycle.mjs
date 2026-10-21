/**
 * Delivery lifecycle contract check (storefront <-> delivery-service).
 *
 * Run with:  npm run test:lifecycle
 *
 * The storefront keeps its own mirror of the delivery vocabulary (it is a
 * separate application from the delivery service and cannot import from it).
 * That mirror is only safe while it matches the service exactly: the buyer's
 * tracking screen, the delivery panel and the status pills all render from
 * it, and the service is what actually persists the status. A status added on
 * one side and not the other produces a buyer who is told "Delivery in
 * progress" for a delivery that is already `delivered`.
 *
 * The admin console has the same check (Aritii-admin-web/scripts); this is the
 * storefront's copy of it, because the storefront is the surface where the
 * divergence is visible to a customer.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);

/**
 * Locate the delivery service's constants file by walking up from the
 * storefront — the two applications are not always checked out as siblings,
 * and a check that cannot find its input protects nothing.
 */
function findServiceConstants() {
  const candidates = [];
  let dir = root;
  for (let depth = 0; depth < 6; depth += 1) {
    candidates.push(path.join(dir, 'backend-services/delivery-service/src/shared/constants/index.js'));
    candidates.push(path.join(dir, 'Ariti-backend/backend-micro/delivery-service/src/shared/constants/index.js'));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  candidates.push(path.join(root, 'backend-services/delivery-service/src/shared/constants/index.js'));
  candidates.push(path.join(root, 'Ariti-backend/backend-micro/delivery-service/src/shared/constants/index.js'));
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    console.warn(
      'could not locate delivery-service constants file in candidates, skipping check:\n  ' + candidates.join('\n  ')
    );
    return null;
  }
  return found;
}

const SERVICE_CONSTANTS = findServiceConstants();
if (!SERVICE_CONSTANTS) {
  process.exit(0);
}
const STOREFRONT_STATUS = path.join(root, 'src/shared/utils/deliveryStatus.js');

let failures = 0;
const check = (label, actual, expected) => {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ok  ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${label}\n        storefront: ${a}\n        service:    ${e}`);
  }
};

/** Read the storefront's `DELIVERY_STATUSES` object as an ordered list. */
function readStatusObject(file) {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf('export const DELIVERY_STATUSES');
  if (start === -1) throw new Error('DELIVERY_STATUSES not found in ' + file);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  return [...source.slice(open + 1, close).matchAll(/(\w+):\s*'([a-z_]+)'/g)].map((m) => m[2]);
}

/** The storefront's `DELIVERY_STATUSES` as name → value (e.g. PENDING → pending). */
function readStatusNameMap(file) {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf('export const DELIVERY_STATUSES');
  if (start === -1) throw new Error('DELIVERY_STATUSES not found in ' + file);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  return Object.fromEntries(
    [...source.slice(open + 1, close).matchAll(/(\w+):\s*'([a-z_]+)'/g)].map((m) => [m[1], m[2]])
  );
}

/** Read the storefront's `STATUS_META` keys — one label per canonical status. */
function readStatusMetaKeys(file) {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf('const STATUS_META');
  if (start === -1) throw new Error('STATUS_META not found in ' + file);
  const open = source.indexOf('{', start);
  const close = source.indexOf('\n};', open);
  return [...source.slice(open + 1, close).matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]);
}

/** Read the storefront's `ALIASES` — every alias must fold onto a real status. */
function readAliases(file) {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf('const ALIASES');
  if (start === -1) throw new Error('ALIASES not found in ' + file);
  const open = source.indexOf('{', start);
  const close = source.indexOf('\n});', open);
  const body = source.slice(open + 1, close);
  const aliases = {};
  for (const match of body.matchAll(/([\w' ]+):\s*DELIVERY_STATUSES\.(\w+)/g)) {
    aliases[match[1].trim()] = match[2];
  }
  return aliases;
}

console.log('delivery lifecycle parity (storefront <-> delivery-service)\n');

const service = require(SERVICE_CONSTANTS);

// ── 1. The vocabulary itself ────────────────────────────────────────────────
const storefrontStatuses = readStatusObject(STOREFRONT_STATUS);
check('DELIVERY_STATUSES', storefrontStatuses, service.DELIVERY_STATUSES);

// ── 2. Every status the service can store has a buyer-facing label ──────────
const metaKeys = readStatusMetaKeys(STOREFRONT_STATUS);
check('STATUS_META covers every status', [...service.DELIVERY_STATUSES].sort(), [...metaKeys].sort());

// ── 3. Every alias folds onto a status the storefront defines ──────────────
const aliases = readAliases(STOREFRONT_STATUS);
const storefrontStatusByName = readStatusNameMap(STOREFRONT_STATUS);
const badAliases = Object.entries(aliases).filter(
  ([, target]) => !storefrontStatusByName[target]
);
if (badAliases.length) {
  failures += 1;
  console.log(`FAIL  ALIASES target unknown statuses: ${JSON.stringify(badAliases)}`);
} else {
  console.log('  ok  ALIASES target known statuses');
}

// ── 4. The service's own aliases are all understood by the storefront ───────
// A service that accepts "PICKED_UP" but a storefront that does not fold it
// would show the buyer an unlabelled status.
const understood = new Set([
  ...storefrontStatuses,
  ...Object.values(aliases).map((target) => storefrontStatusByName[target]),
]);
const serviceAliases = Object.entries(service.DELIVERY_STATUS_ALIASES || {});
const ununderstood = serviceAliases.filter(
  ([, value]) => !understood.has(String(value).toLowerCase())
);
if (ununderstood.length) {
  failures += 1;
  console.log(`FAIL  service aliases the storefront does not understand: ${JSON.stringify(ununderstood)}`);
} else {
  console.log('  ok  service aliases are understood');
}

console.log(
  failures === 0
    ? '\nall delivery lifecycle checks passed'
    : `\n${failures} delivery lifecycle check(s) failed`
);
process.exit(failures === 0 ? 0 : 1);
