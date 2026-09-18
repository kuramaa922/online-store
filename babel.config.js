/**
 * Общий конфиг Babel: его используют и webpack (babel-loader), и Jest (babel-jest).
 * Благодаря этому тесты и сборка понимают один и тот же синтаксис.
 */
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // Какие браузеры поддерживаем - берётся из поля browserslist в package.json
                targets: { browsers: ['defaults'] },
                // Оставляем ES-модули webpack'у: он умеет tree shaking
                // Для Jest (CommonJS) модули транспилируем - см. env.test ниже
                modules: false,
            },
        ],
        // Новый JSX-трансформ: не нужно импортировать React в каждом файле
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
    ],
    env: {
        test: {
            presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        },
    },
};
