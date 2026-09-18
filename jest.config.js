/**
 * Jest + React Testing Library.
 * Код для тестов транспилирует babel-jest по общему babel.config.js.
 */
module.exports = {
    // Эмуляция браузерного окружения (document, window)
    testEnvironment: 'jsdom',

    // Jest не запускает webpack, поэтому константы из DefinePlugin
    // (webpack.config.js) в тестах нужно объявить здесь заново.
    // Тестам настоящий адрес не нужен — запросы к API в тестах мокают.
    globals: {
        __API_URL__: 'https://api.test/products.json',
    },

    // Выполняется перед каждым файлом тестов: подключает матчеры вроде toBeInTheDocument()
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Тот же алиас, что в webpack и tsconfig
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',

        // Jest не умеет импортировать стили и картинки - подменяем заглушками
        '\\.module\\.css$': 'identity-obj-proxy',
        '\\.(css|less|scss)$': '<rootDir>/jest.styleMock.js',
        '\\.(png|jpe?g|gif|webp|avif|svg|woff2?|ttf|eot)$': '<rootDir>/jest.fileMock.js',
    },

    testMatch: ['<rootDir>/src/**/*.{test,spec}.{ts,tsx}'],

    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/main.tsx'],
};
