import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';

// Стили библиотеки подключаются ДО собственных, чтобы их можно было переопределить
import '@mantine/core/styles.css';
import '@/styles/index.css';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Не найден элемент #root - проверьте public/index.html');
}

createRoot(container).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="light">
            <App />
        </MantineProvider>
    </StrictMode>,
);
