import type { SourceKey } from '../types';
import { SOURCE_PRESETS } from '../constants';
import { store } from '../state/store';
import { ManifestService } from '../services/manifestService';
import { UrlService } from '../services/urlService';

export class SourceSwitcher {
    public static init(): void {
        const tabs = document.querySelectorAll<HTMLButtonElement>('.source-selector-tab');
        if (!tabs.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener('click', async () => {
                const sourceKey = (tab.getAttribute('data-source') || 'main') as SourceKey;
                const currentKey = store.getState().currentSourceKey;

                if (sourceKey === currentKey) return;

                const preset = SOURCE_PRESETS[sourceKey] || SOURCE_PRESETS.main;
                UrlService.updateSourceInUrl(sourceKey);
                await ManifestService.loadManifest(sourceKey, preset.url);
            });
        });

        // Sync tab active states with store
        store.select(
            (s) => s.currentSourceKey,
            (key) => {
                tabs.forEach((tab) => {
                    const isMatch = tab.getAttribute('data-source') === key;
                    tab.classList.toggle('active', isMatch);
                    tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
                });
            }
        );

        // Initial active sync
        const currentKey = store.getState().currentSourceKey;
        tabs.forEach((tab) => {
            const isMatch = tab.getAttribute('data-source') === currentKey;
            tab.classList.toggle('active', isMatch);
            tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
    }
}

