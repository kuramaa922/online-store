import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Матчеры вроде toBeInTheDocument() подключены импортом выше.
 *
 * Очистка DOM после каждого теста. В Jest Testing Library делает это сама,
 * а в Vitest без глобальных describe/it/afterEach — только если вызвать явно.
 */
afterEach(() => {
    cleanup();
});

/**
 * Mantine использует window.matchMedia и ResizeObserver, которых нет в jsdom.
 * Без этих заглушек падают тесты любых компонентов Mantine.
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

window.scrollTo = () => {};
