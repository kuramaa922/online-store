import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';

import App from '@/App';

/**
 * Это пример теста
 * Компоненты Mantine нужно оборачивать в MantineProvider, иначе они упадут:
 * удобно вынести такую обёртку в отдельный хелпер renderWithProviders()
 */
describe('App', () => {
    it('отображает название магазина', () => {
        render(
            <MantineProvider>
                <App />
            </MantineProvider>,
        );

        expect(screen.getByRole('heading', { name: /магазин овощей/i })).toBeInTheDocument();
    });
});
