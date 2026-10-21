import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import sonarjs from 'eslint-plugin-sonarjs'
import unusedImports from 'eslint-plugin-unused-imports'

/**
 * The app resolves every intra-project import through the `@` alias
 * (see `vite.config.js` and `jsconfig.json`). The import resolver needs to
 * know about it, otherwise `import/no-unresolved` reports every aliased
 * import as missing.
 */
const aliasResolver = {
  map: [['@', './src']],
  extensions: ['.js', '.jsx', '.mjs', '.json'],
}

/**
 * Node built-ins (`node:fs`, `node:path`, ...) are resolved by the node
 * resolver. Without it every script/test that reads a file from disk was
 * reported as importing a module that does not exist.
 */
const nodeResolver = {
  extensions: ['.js', '.jsx', '.mjs', '.json'],
}

export default [
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '**/*.min.js',
    ],
  },

  // --- Baseline: core recommended rules (no-undef, no-unused-vars, no-dupe-keys, ...)
  js.configs.recommended,

  // --- Application source ---
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: { version: '19.2' },
      'import/resolver': {
        alias: aliasResolver,
        node: nodeResolver,
      },
      'import/parsers': {
        js: ['espree', { ecmaFeatures: { jsx: true }, ecmaVersion: 2022 }],
        jsx: ['espree', { ecmaFeatures: { jsx: true }, ecmaVersion: 2022 }],
      },
      'import/extensions': ['.js', '.jsx', '.mjs', '.json'],
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      sonarjs,
      'unused-imports': unusedImports,
    },
    rules: {
      // ------------------------------------------------------------------
      // Missing / undeclared variables and constants
      // ------------------------------------------------------------------
      'no-undef': 'error',
      // `unused-imports/no-unused-vars` is the core rule with an auto-fixer
      // that strips the unused import specifier (core `no-unused-vars` cannot
      // fix, because removing an import binding is not always safe).
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': [
        'error',
        {
          varsIgnorePattern: '^(React|_[A-Za-z0-9_]*)$',
        },
      ],
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          // The project uses the automatic JSX runtime, so the `import React`
          // line every file carries is not actually referenced. It is a
          // project-wide convention, so it is exempted here instead of
          // drowning the real findings. (Drop the `React` alternative to
          // start reporting the 215 redundant imports.)
          varsIgnorePattern: '^(React|_[A-Za-z0-9_]*)$',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],

      // ------------------------------------------------------------------
      // React
      // ------------------------------------------------------------------
      // The project uses the automatic JSX runtime (@vitejs/plugin-react),
      // so React does not need to be imported into every file.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-key': 'error',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // The rules below encode React Compiler expectations. They are valuable
      // signal, but converting a working (non-compiled) codebase is a
      // refactor, not a bug fix — so they report as warnings for now.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/error-boundaries': 'warn',

      // ------------------------------------------------------------------
      // Duplication
      // ------------------------------------------------------------------
      'import/no-duplicates': ['error', { considerQueryString: true }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-duplicate-string': 'warn',

      // ------------------------------------------------------------------
      // Imports (broken / missing modules)
      // ------------------------------------------------------------------
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-cycle': 'warn',
      'import/no-empty-named-blocks': 'error',

      // ------------------------------------------------------------------
      // Accessibility
      // ------------------------------------------------------------------
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
    },
  },

  // --- Test files: vitest globals ---
  {
    files: ['src/**/*.{test,spec}.{js,jsx}', 'src/test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // --- Config / tooling files at the project root (Node context) ---
  {
    files: [
      '*.config.{js,cjs,mjs}',
      'eslint.config.js',
      'scripts/**/*.{js,mjs,cjs}',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
]
