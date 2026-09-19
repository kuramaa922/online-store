import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

/**
 * Один конфиг на всё: dev-сервер, сборку и тесты (Vitest читает этот же файл).
 * Многое, что в webpack настраивалось вручную, в Vite работает из коробки:
 * TypeScript/JSX, CSS и CSS Modules, картинки, шрифты, хэши в именах файлов,
 * PostCSS (подхватывает postcss.config.js сам), переменные окружения из .env.
 */
export default defineConfig({
    plugins: [
        // JSX + Fast Refresh (обновление компонентов без перезагрузки страницы)
        react(),
        // SVG как React-компонент: import Logo from './logo.svg?react'
        // (без ?react Vite по умолчанию отдаёт SVG как ссылку-строку)
        svgr(),
    ],

    resolve: {
        // Алиас: `@/components/Header` вместо `../../../components/Header`.
        // Тот же путь продублирован в tsconfig.app.json → paths (для TypeScript и IDE).
        // Тестам отдельная настройка не нужна: Vitest использует этот же конфиг.
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },

    server: {
        port: 3000,
        open: true,
    },

    build: {
        // Карты исходников для отладки продакшен-сборки
        sourcemap: true,
        rolldownOptions: {
            output: {
                // Хэши в именах (main-[hash].js) Vite ставит сам. Здесь только выносим
                // библиотеки из node_modules в отдельный чанк: они меняются редко,
                // поэтому браузер держит их в кэше между релизами.
                codeSplitting: {
                    groups: [{ name: 'vendors', test: /node_modules/ }],
                },
            },
        },
    },

    // Настройки Vitest
    test: {
        // Эмуляция браузера (document, window) — как testEnvironment в Jest
        environment: 'jsdom',
        // Выполняется перед каждым файлом тестов
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/**/*.d.ts', 'src/main.tsx', 'src/**/*.test.{ts,tsx}'],
        },
    },
});
