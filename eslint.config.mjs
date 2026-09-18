import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
    {
        ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    },

    js.configs.recommended,

    // --- Исходники приложения: строгие правила с проверкой типов ---------------
    {
        files: ['src/**/*.{ts,tsx}', 'jest.setup.ts'],
        extends: [
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser },
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            import: importPlugin,
            'jsx-a11y': jsxA11y,
            'unused-imports': unusedImports,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,

            // React
            'react/prop-types': 'off',
            'react/jsx-no-useless-fragment': 'warn',
            'react/self-closing-comp': 'warn',

            // TypeScript
            // Неиспользуемые импорты: ошибка + автоудаление при `eslint --fix`
            // (и при коммите через lint-staged). Стандартное правило
            // no-unused-vars их только находит, но удалять не умеет.
            'unused-imports/no-unused-imports': 'error',
            // Неиспользуемые переменные — это правило плагина заменяет
            // @typescript-eslint/no-unused-vars, поэтому исходное выключено
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: { attributes: false } },
            ],

            // Порядок импортов: библиотеки → свои модули → стили
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'type',
                    ],
                    pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/no-duplicates': 'warn',

            // По условию задачи состояние - только на Context API
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        { name: 'redux', message: 'Состояние корзины делаем на Context API.' },
                        {
                            name: 'react-redux',
                            message: 'Состояние корзины делаем на Context API.',
                        },
                        {
                            name: '@reduxjs/toolkit',
                            message: 'Состояние корзины делаем на Context API.',
                        },
                        { name: 'zustand', message: 'Состояние корзины делаем на Context API.' },
                        { name: 'mobx', message: 'Состояние корзины делаем на Context API.' },
                        {
                            name: 'mobx-react-lite',
                            message: 'Состояние корзины делаем на Context API.',
                        },
                        { name: 'jotai', message: 'Состояние корзины делаем на Context API.' },
                        { name: 'recoil', message: 'Состояние корзины делаем на Context API.' },
                        { name: 'effector', message: 'Состояние корзины делаем на Context API.' },
                    ],
                },
            ],

            // Общие
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            'prefer-const': 'warn',
            'object-shorthand': 'warn',
        },
    },

    // --- Тесты: доступны глобальные describe/it/expect --------------------------
    {
        files: ['src/**/*.{test,spec}.{ts,tsx}', 'jest.setup.ts'],
        languageOptions: {
            globals: { ...globals.jest },
        },
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/unbound-method': 'off',
        },
    },

    // --- Конфиги сборки на CommonJS (webpack, babel, postcss, jest) -------------
    {
        files: ['**/*.js', '**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: { ...globals.node },
        },
        rules: {
            'no-console': 'off',
        },
    },

    // --- Конфиги на ES-модулях (сам eslint.config.mjs) --------------------------
    {
        files: ['**/*.mjs'],
        languageOptions: {
            sourceType: 'module',
            globals: { ...globals.node },
        },
    },

    // Prettier отключает стилистические правила - всегда последним
    prettier,
);
