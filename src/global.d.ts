/** Константы, которые webpack подставляет на этапе сборки (DefinePlugin) */
declare const __API_URL__: string;

/** Импорты статики, чтобы TypeScript не ругался на `import img from './a.png'` */
declare module '*.png' {
    const src: string;
    export default src;
}
declare module '*.jpg' {
    const src: string;
    export default src;
}
declare module '*.jpeg' {
    const src: string;
    export default src;
}
declare module '*.gif' {
    const src: string;
    export default src;
}
declare module '*.webp' {
    const src: string;
    export default src;
}

/** SVG по умолчанию приходит React-компонентом (см. @svgr/webpack в webpack.config.js) */
declare module '*.svg' {
    import type { FunctionComponent, SVGProps } from 'react';
    const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
    export default ReactComponent;
}

/** ...а с ?url - обычной строкой-ссылкой */
declare module '*.svg?url' {
    const src: string;
    export default src;
}

/** CSS Modules: ключи - имена классов */
declare module '*.module.css' {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}

declare module '*.css';
