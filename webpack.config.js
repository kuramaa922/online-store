const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

// Читаем переменные из .env в process.env (в бандл попадут только те, что ниже в DefinePlugin)
require('dotenv').config({ quiet: true });

const src = path.resolve(__dirname, 'src');

/**
 * Конфиг собирается функцией: webpack передаёт сюда режим сборки,
 * который мы указываем в скриптах (`webpack serve --mode development`).
 */
module.exports = (_env, argv) => {
    const isDev = argv.mode === 'development';
    const isProd = !isDev;

    return {
        // Точка входа приложения
        entry: path.join(src, 'main.tsx'),

        // --- Куда и как складываем результат -----------------------------------
        output: {
            path: path.resolve(__dirname, 'dist'),
            // contenthash - хэш от содержимого файла. Поменялся код → поменялось имя
            // → браузер скачает новый файл, а не возьмёт устаревший из кэша.
            // В dev хэши не нужны: они мешают читать логи и замедляют пересборку.
            filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
            chunkFilename: isProd ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
            // Картинки/шрифты тоже с хэшем
            assetModuleFilename: 'assets/[name].[hash:8][ext][query]',
            // Чистим dist перед каждой сборкой
            clean: true,
            // Нужен, чтобы роутинг и ассеты работали из корня сайта
            publicPath: '/',
        },

        // --- Алиасы и разрешение импортов ---------------------------------------
        resolve: {
            // Расширения, которые можно не писать в импортах
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
            // Алиас: пишем `@/components/Header` вместо `../../../components/Header`.
            // Один алиас на всю папку src - структуру внутри неё вы придумываете сами,
            // и импорты не придётся менять при переносе файлов.
            // ВАЖНО: тот же путь продублирован в tsconfig.json → compilerOptions.paths
            // и в jest.config.js → moduleNameMapper, иначе TS, IDE и тесты о нём не узнают.
            alias: {
                '@': src,
            },
        },

        // --- Правила обработки файлов -------------------------------------------
        module: {
            rules: [
                // TypeScript / JSX → современный JS через Babel (настройки в babel.config.js)
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            // Кэш ускоряет повторные сборки в несколько раз
                            cacheDirectory: true,
                            // Fast Refresh: обновляет компонент в браузере без перезагрузки страницы
                            plugins: isDev ? ['react-refresh/babel'] : [],
                        },
                    },
                },

                // Стили. Порядок лоадеров читается СПРАВА НАЛЕВО:
                // postcss → css → style/extract
                {
                    test: /\.css$/i,
                    use: [
                        // В dev стили инлайнятся в <style> (быстро и с HMR),
                        // в prod выносятся в отдельный .css файл с хэшем.
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                // CSS Modules включаются автоматически для файлов *.module.css
                                modules: {
                                    auto: true,
                                    localIdentName: isDev
                                        ? '[name]__[local]--[hash:base64:5]'
                                        : '[hash:base64:8]',
                                    namedExport: false,
                                    exportLocalsConvention: 'camelCaseOnly',
                                },
                                importLoaders: 1,
                            },
                        },
                        // Автопрефиксы и синтаксис Mantine (настройки в postcss.config.js)
                        'postcss-loader',
                    ],
                },

                // SVG: по умолчанию - React-компонент (<Logo />),
                // а с query `?url` - обычная ссылка (import logoUrl from './logo.svg?url')
                {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    resourceQuery: { not: [/url/] },
                    use: ['@svgr/webpack'],
                },
                {
                    test: /\.svg$/i,
                    type: 'asset/resource',
                    resourceQuery: /url/,
                },

                // Растровые картинки. `asset` сам решает: файл < 8 КБ станет base64-строкой
                // внутри бандла (меньше запросов), больше - отдельным файлом с хэшем.
                {
                    test: /\.(png|jpe?g|gif|webp|avif|ico)$/i,
                    type: 'asset',
                    parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
                },

                // Шрифты - всегда отдельными файлами
                {
                    test: /\.(woff2?|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: { filename: 'fonts/[name].[hash:8][ext]' },
                },
            ],
        },

        // --- Плагины -------------------------------------------------------------
        plugins: [
            // Генерирует dist/index.html и сам подставляет <script> и <link> с хэшами
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html'),
                favicon: path.resolve(__dirname, 'public', 'favicon.svg'),
                minify: isProd && {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true,
                },
            }),

            // Выносит CSS в отдельный файл (только в проде)
            isProd &&
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash:8].css',
                    chunkFilename: 'css/[name].[contenthash:8].chunk.css',
                }),

            // Fast Refresh (только в dev)
            isDev && new ReactRefreshWebpackPlugin({ overlay: false }),

            // Подставляет значения переменных прямо в код на этапе сборки.
            // В браузере нет process.env - работает только то, что описано здесь.
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(argv.mode),
                // Своя глобальная константа вместо process.env: в браузере process не существует.
                // Тип объявлен в src/types/global.d.ts
                __API_URL__: JSON.stringify(
                    process.env.API_URL ??
                        'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json',
                ),
            }),
        ].filter(Boolean),

        // --- Оптимизация ---------------------------------------------------------
        optimization: {
            minimizer: [
                // `...` = оставить стандартный минификатор JS (Terser)
                '...',
                new CssMinimizerPlugin(),
            ],
            // Библиотеки из node_modules - в отдельный чанк: они меняются редко,
            // поэтому их хэш стабилен и браузер держит их в кэше между релизами.
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
            // Служебный код webpack - отдельно, иначе он ломает хэши всех чанков
            runtimeChunk: 'single',
        },

        // --- Dev-сервер ----------------------------------------------------------
        devServer: {
            port: 3000,
            open: true,
            hot: true,
            // Любой URL отдаёт index.html - нужно для клиентского роутинга
            historyApiFallback: true,
            client: { overlay: { errors: true, warnings: false } },
            static: { directory: path.resolve(__dirname, 'public') },
        },

        // Карты исходников: в dev - быстрые, в prod - полные и отдельным файлом
        devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',

        // Убираем шум из вывода сборки
        stats: 'minimal',

        performance: {
            hints: isProd ? 'warning' : false,
            maxAssetSize: 512 * 1024,
            maxEntrypointSize: 512 * 1024,
        },
    };
};
