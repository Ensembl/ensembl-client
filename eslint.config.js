/*
  Eslint doesn't like that this file is using commonjs module syntax.
  Hopefully, we will be able to migrate the whole project to ES modules eventually.
  In the meantime, the linting of this file is disabled.
*/

/* eslint-disable */

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const vitestPlugin = require('@vitest/eslint-plugin');


module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactRecommended,
  reactPlugin.configs.flat['jsx-runtime'],
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
    },
    plugins: {
      react: reactPlugin
    },
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
      'prettier/prettier': 0,
      'no-unused-vars': 'off',
      'no-unneeded-ternary': 'error',
      'no-empty': 'error',
      'eqeqeq': 'error'
    },
    settings: {
      react: {
        version: 'detect' // Makes eslint-plugin-react automatically detect React version
      }
    }
  },

  // settings for eslint-plugin-react-hooks
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 2
    },
  },

  // settings for eslint-plugin-vitest
  {
    plugins: {
      vitest: vitestPlugin
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/no-focused-tests': 'error'
    },
  },
);
