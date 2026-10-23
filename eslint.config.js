import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'
import globals from 'globals'

export default [
  {
    // Flat config does not read .gitignore; these are its build and cache outputs.
    ignores: ['dist/**', 'dist-ssr/**', '.nuxt/**', '.output/**', '.netlify/**', '.data/**', '.nitro/**', '.cache/**', 'coverage/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['app/**', 'shared/**', 'netlify/**'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['server/**', 'shared/**', '*.config.js'],
    languageOptions: { globals: globals.node }
  },
  {
    // Nitro auto-imports these in server/; the app side imports explicitly from #imports.
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        defineEventHandler: 'readonly',
        setHeader: 'readonly'
      }
    }
  },
  // Prettier owns formatting (pnpm format), so ESLint's formatting rules stay off.
  skipFormatting
]
