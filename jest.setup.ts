import '@testing-library/jest-dom';

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
