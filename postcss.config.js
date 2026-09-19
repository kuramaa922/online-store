/**
 * PostCSS — постобработка CSS. Vite находит этот файл и применяет его сам.
 * postcss-preset-mantine добавляет функции Mantine (light-dark(), rem(), миксины),
 * postcss-simple-vars хранит брейкпоинты, autoprefixer расставляет вендорные префиксы.
 */
export default {
    plugins: {
        'postcss-preset-mantine': {},
        'postcss-simple-vars': {
            variables: {
                'mantine-breakpoint-xs': '36em',
                'mantine-breakpoint-sm': '48em',
                'mantine-breakpoint-md': '62em',
                'mantine-breakpoint-lg': '75em',
                'mantine-breakpoint-xl': '88em',
            },
        },
        autoprefixer: {},
    },
};
