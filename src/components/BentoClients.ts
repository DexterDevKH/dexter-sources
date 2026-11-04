import type { SideloadClientKey } from '../types';
import { SCHEMES } from '../constants';
import { store } from '../state/store';
import { UrlService } from '../services/urlService';
import { Toast } from './Toast';

export class BentoClients {
    public static init(): void {
        const clientBtns = document.querySelectorAll<HTMLAnchorElement>('.bento-card[data-key]');
        const excludedSet = UrlService.getExcludedClients();

        clientBtns.forEach((btn) => {
            const key = btn.getAttribute('data-key') as SideloadClientKey;
            if (!key) return;

            // Hide if excluded via URL parameter
            if (excludedSet.has(key)) {
                btn.style.display = 'none';
                return;
            }

            // Click handling with friendly desktop fallback
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                if (!href || href === '#') {
                    e.preventDefault();
                    return;
                }

                // If on desktop (non-mobile iOS/iPadOS), inform user or copy manifest URL
                const isMobileApple = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

                if (!isMobileApple) {
                    Toast.show(`Opening ${key.charAt(0).toUpperCase() + key.slice(1)}...`, 2000);
                }
            });
        });

        // Sync deep-link URLs whenever current source URL changes
        const updateLinks = (sourceUrl: string): void => {
            clientBtns.forEach((btn) => {
                const key = btn.getAttribute('data-key') as SideloadClientKey;
                if (key && SCHEMES[key]) {
                    btn.href = SCHEMES[key](sourceUrl);
                }
            });
        };

        store.select(
            (s) => s.currentSourceUrl,
            (url) => updateLinks(url)
        );

        updateLinks(store.getState().currentSourceUrl);
    }
}

