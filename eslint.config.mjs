import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    rules: {
      'no-undef': 'off',
      'no-useless-escape': 'off',
      'no-useless-assignment': 'off',
      'prefer-const': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-irregular-whitespace': [
        'error',
        {
          skipStrings: true,
          skipComments: true,
          skipRegExps: true,
          skipTemplates: true,
          skipJSXText: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^(_|node$)',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
