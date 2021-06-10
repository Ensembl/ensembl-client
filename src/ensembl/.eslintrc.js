module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // Displays prettier errors as ESLint errors. This has to be the last in this array (not yet sure why).
  ],
  plugins: ['react-hooks', 'jest'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  // rules options: 0 = off, 1 = warn, 2 = error
  rules: {
    'no-console': [1, { allow: ['error', 'info', 'warn'] }],
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used' }],
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react-hooks/rules-of-hooks': 2,
    'prettier/prettier': 0,
    'no-unused-vars': 'off',
    'no-unneeded-ternary': 'error',
    'eqeqeq': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error'
  },
  settings: {
    react: {
      version: 'detect' // Makes eslint-plugin-react to detect the React version
    }
  }
};
