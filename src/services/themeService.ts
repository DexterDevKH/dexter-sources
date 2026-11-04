import type { ThemeMode } from '../types';
import { store } from '../state/store';

const THEME_STORAGE_KEY = 'dexter-theme';

export class ThemeService {
    public static init(): void {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        let initialTheme: ThemeMode = 'dark';

        if (saved === 'light' || saved === 'dark') {
            initialTheme = saved;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            initialTheme = 'light';
        }

        this.applyTheme(initialTheme);

        // System preference change listener
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
                if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                    this.applyTheme(e.matches ? 'light' : 'dark');
                }
            });
        }

        // Store sync listener
        store.select(
            (s) => s.theme,
            (theme) => {
                this.applyTheme(theme);
            }
        );
    }

    public static toggle(): void {
        const current = store.getState().theme;
        const next: ThemeMode = current === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_STORAGE_KEY, next);
        store.setState({ theme: next });
    }

    private static applyTheme(theme: ThemeMode): void {
        document.documentElement.setAttribute('data-theme', theme);

        const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
        if (themeColorMeta) {
            themeColorMeta.content = theme === 'dark' ? '#080b12' : '#f1f4f9';
        }
    }
}

