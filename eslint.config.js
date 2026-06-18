import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    'test-results/**',
    'playwright-report/**',
    'xanh-playwright-tests/playwright-report/**',
    'exanh-playwright-tests/playwright-report/**',
    '**/playwright-report/**',
    '**/trace/**',
    '**/trace/assets/**',
    '_archive/**',
    'playwright.config.js',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/app/router.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
