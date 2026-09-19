/**
 * Типы для переменных окружения. Vite кладёт в import.meta.env только переменные
 * с префиксом VITE_ — остальные из .env в браузерный код не попадают.
 */
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
