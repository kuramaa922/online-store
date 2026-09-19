import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
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
        files: ['src/**/*.{ts,tsx}', 'vitest.setup.ts', 'vite.config.ts'],
        extends: [
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser },
            parserOptions: {
                // Сам находит нужный tsconfig (app или node) для каждого файла
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: ['./tsconfig.app.json', './tsconfig.node.json'],
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
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
            // Fast Refresh в Vite работает, только если файл экспортирует одни компоненты
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
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

    // --- Тесты (describe/it/expect импортируются из 'vitest') --------------------
    {
        files: ['src/**/*.{test,spec}.{ts,tsx}', 'vitest.setup.ts'],
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/unbound-method': 'off',
        },
    },

    // --- Конфиги (vite, postcss, eslint): выполняются в Node.js -----------------
    // В package.json стоит "type": "module", поэтому .js — это ES-модули
    {
        files: ['*.{js,mjs,ts}'],
        languageOptions: {
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: {
            'no-console': 'off',
        },
    },

    // Prettier отключает стилистические правила - всегда последним
    prettier,
);
