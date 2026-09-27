/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off'
  },
  overrides: [
    {
      // Nitro auto-imports these in server/; the app side imports explicitly from #imports.
      files: ['server/**/*.js'],
      env: { node: true },
      globals: {
        defineEventHandler: 'readonly',
        setHeader: 'readonly'
      }
    }
  ]
}
