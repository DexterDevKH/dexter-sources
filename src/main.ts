/**
 * DexterDevKH Apps — Modern Bun & TypeScript Orchestrator
 * High-performance iOS sideloading source portal.
 */

import { store } from './state/store';
import { ThemeService } from './services/themeService';
import { UrlService } from './services/urlService';
import { ManifestService } from './services/manifestService';

import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NewsBanner } from './components/NewsBanner';
import { SourceSwitcher } from './components/SourceSwitcher';
import { BentoClients } from './components/BentoClients';
import { SourceUrlBar } from './components/SourceUrlBar';
import { SearchAndFilter } from './components/SearchAndFilter';
import { AppCard } from './components/AppCard';
import { AppModal } from './components/AppModal';
import { LightboxModal } from './components/LightboxModal';
import { QrModal } from './components/QrModal';

class App {
    public static async init(): Promise<void> {
        // Initialize Core Services & UI Components
        ThemeService.init();
        Toast.init();

        LightboxModal.init();
        AppModal.init((urls, index, title) => {
            LightboxModal.open(urls, index, title);
        });
        QrModal.init();

        Header.init(() => {
            QrModal.open();
        });
        Hero.init();
        NewsBanner.init();
        SourceSwitcher.init();
        BentoClients.init();
        SourceUrlBar.init();
        SearchAndFilter.init();

        // Bind Dynamic Apps Grid
        const appsListContainer = document.getElementById('appsListContainer');
        if (appsListContainer) {
            const render = () => {
                const apps = store.getState().manifest.apps || [];
                AppCard.renderGrid(
                    appsListContainer,
                    apps,
                    (app) => {
                        AppModal.open(app);
                    },
                    (urls, idx, title) => {
                        LightboxModal.open(urls, idx, title);
                    }
                );
            };

            store.select(
                (s) => s.manifest.apps,
                () => render()
            );

            store.select(
                (s) => `${s.searchQuery}:${s.activeCategory}:${s.currentSourceKey}`,
                () => render()
            );

            render();
        }

        // Handle URL parameters and initial source loading
        const initial = UrlService.getInitialSource();

        // Process one-tap sideloading auto-redirect if ?r=... is specified
        if (UrlService.handleAutoRedirect(initial.url)) {
            return;
        }

        // Fetch live manifest asynchronously
        const manifest = await ManifestService.loadManifest(initial.key, initial.url);

        // Check for deep-linked ?app= query parameter to auto-open details
        const targetAppId = UrlService.getTargetAppId();
        if (targetAppId && manifest?.apps) {
            const matchedApp = manifest.apps.find(
                (a) =>
                    a.bundleIdentifier.toLowerCase() === targetAppId.toLowerCase() ||
                    a.name.toLowerCase() === targetAppId.toLowerCase()
            );
            if (matchedApp) {
                setTimeout(() => AppModal.open(matchedApp), 300);
            }
        }
    }
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

