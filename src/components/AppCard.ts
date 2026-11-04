import type { ManifestApp } from '../types';
import { formatBytes, formatDate, getAppCategory, getAppIconUrl } from '../utils/formatters';
import { enableHorizontalScroll } from '../utils/scrollHelper';
import { store } from '../state/store';

// Curated feature highlights for Dexter's apps
const APP_FEATURES: Record<string, string[]> = {
    'com.google.ios.youtube': ['Ad-Blocking', 'SponsorBlock', 'Background PiP', 'OLED Dark Mode'],
    'com.google.ios.youtubemusic': ['Lossless EQ', 'Ad-Free Audio', 'Real-Time Lyrics', 'Offline Cache'],
    'com.google.ios.youtube.dtkace': ['YTKACE Engine', '4K Downloader', 'Dislike Counter', 'Volume Boost']
};

export class AppCard {
    public static renderGrid(
        container: HTMLElement,
        apps: ManifestApp[],
        onSelectApp: (app: ManifestApp) => void,
        onOpenLightbox?: (urls: string[], index: number, title: string) => void
    ): void {
        container.innerHTML = '';

        const state = store.getState();
        const query = state.searchQuery.toLowerCase();
        const category = state.activeCategory;

        const filtered = apps.filter((app) => {
            // Category filter
            if (category !== 'all') {
                const appCat = getAppCategory(app);
                if (category === 'entertainment' && appCat !== 'entertainment') return false;
                if (category === 'music' && appCat !== 'music') return false;
            }

            // Search query filter
            if (query) {
                const name = (app.name || '').toLowerCase();
                const sub = (app.subtitle || '').toLowerCase();
                const dev = (app.developerName || '').toLowerCase();
                const desc = (app.localizedDescription || '').toLowerCase();
                const bundle = (app.bundleIdentifier || '').toLowerCase();

                return (
                    name.includes(query) ||
                    sub.includes(query) ||
                    dev.includes(query) ||
                    desc.includes(query) ||
                    bundle.includes(query)
                );
            }

            return true;
        });

        if (filtered.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-search-state';
            emptyEl.innerHTML = `
                <div class="empty-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <div class="empty-title">No Applications Found</div>
                <div class="empty-desc">No applications match "<strong>${state.searchQuery}</strong>". Try another keyword or filter.</div>
            `;
            container.appendChild(emptyEl);
            return;
        }

        filtered.forEach((app) => {
            const cardEl = this.createCardElement(
                app,
                state.currentSourceKey,
                () => onSelectApp(app),
                onOpenLightbox
            );
            container.appendChild(cardEl);
        });
    }

    private static createCardElement(
        app: ManifestApp,
        currentSourceKey: string,
        onSelect: () => void,
        onOpenLightbox?: (urls: string[], index: number, title: string) => void
    ): HTMLElement {
        const latestVer = Array.isArray(app.versions) && app.versions[0] ? app.versions[0] : app;
        const versionStr = 'version' in latestVer && latestVer.version ? latestVer.version : (app.version || 'Latest');
        const downloadUrl = 'downloadURL' in latestVer && latestVer.downloadURL ? latestVer.downloadURL : (app.downloadURL || '#');
        const sizeFormatted = formatBytes('size' in latestVer && latestVer.size ? latestVer.size : (app.size || 0));
        const verDateStr = 'date' in latestVer ? latestVer.date : undefined;
        const formattedDate = formatDate(verDateStr);

        const card = document.createElement('article');
        card.className = 'ios-app-card';
        card.setAttribute('role', 'article');

        // Extract feature tags
        let featureList = APP_FEATURES[app.bundleIdentifier] || [];
        if (currentSourceKey === 'dtkace' && app.bundleIdentifier === 'com.google.ios.youtube') {
            featureList = APP_FEATURES['com.google.ios.youtube.dtkace'];
        }

        // Screenshots list
        let rawScreenshots: any[] = [];
        if (Array.isArray(app.screenshots)) {
            rawScreenshots = app.screenshots;
        } else if (app.screenshots && typeof app.screenshots === 'object') {
            if (Array.isArray(app.screenshots.iphone) && app.screenshots.iphone.length > 0) {
                rawScreenshots = app.screenshots.iphone;
            } else if (Array.isArray(app.screenshots.ipad) && app.screenshots.ipad.length > 0) {
                rawScreenshots = app.screenshots.ipad;
            }
        }
        const screenshotUrls = rawScreenshots
            .map((s) => (typeof s === 'string' ? s : s?.imageURL ? s.imageURL : ''))
            .filter(Boolean);

        const category = getAppCategory(app);
        const categoryLabel = category === 'entertainment' ? 'Video' : 'Music';

        // Native iOS App Store Card Structure
        card.innerHTML = `
            <!-- Top App Store Header Row: Icon + Meta + GET Button -->
            <div class="card-header-row">
                <div class="card-header-left" role="button" tabindex="0">
                    <div class="app-icon-squircle-wrap">
                        <img class="app-icon-squircle" src="${getAppIconUrl(app, currentSourceKey)}" alt="${app.name} Icon" loading="lazy" />
                    </div>
                    <div class="app-header-meta">
                        <div class="app-name-row">
                            <h3 class="app-title-text">${app.name}</h3>
                            <span class="app-badge-verified" title="Verified Application">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                            </span>
                        </div>
                        <div class="app-author-row">
                            <span class="app-dev-name">${app.developerName || 'DexterDevKH'}</span>
                            <span class="meta-dot">&bull;</span>
                            <span class="app-category-tag ${category}">${categoryLabel}</span>
                        </div>
                    </div>
                </div>

                <!-- Iconic iOS App Store "GET" Button -->
                <div class="card-header-right">
                    <a class="ios-get-btn" href="${downloadUrl}" target="_blank" rel="noopener" title="Download IPA directly">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="get-icon">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>GET</span>
                    </a>
                </div>
            </div>

            <!-- Subtitle Description -->
            <p class="app-card-subtitle">${app.subtitle || 'Enhanced iOS Application with optimized playback & ad-free streaming'}</p>

            <!-- Feature Pills Strip -->
            <div class="app-feature-chips">
                ${featureList.map((f) => `<span class="feature-chip"><span class="chip-sparkle">✦</span>${f}</span>`).join('')}
            </div>

            <!-- Horizontal Swipeable Screenshots Carousel -->
            ${
                screenshotUrls.length > 0
                    ? `
                <div class="app-screenshot-carousel" aria-label="Screenshots">
                    ${screenshotUrls
                        .map(
                            (url, idx) => `
                        <div class="screenshot-slide" data-idx="${idx}" role="button" tabindex="0" title="Tap to preview full screenshot">
                            <img src="${url}" alt="${app.name} Screenshot ${idx + 1}" loading="lazy" />
                        </div>
                    `
                        )
                        .join('')}
                </div>
            `
                    : ''
            }

            <!-- Bottom Specs & Details Toggle Bar -->
            <div class="app-card-footer">
                <div class="footer-specs">
                    <span class="spec-tag version">
                        <span class="live-dot"></span>
                        v${versionStr}
                    </span>
                    <span class="spec-tag">${sizeFormatted}</span>
                    <span class="spec-tag">${formattedDate}</span>
                </div>

                <button class="details-link-btn" type="button" aria-label="View changelog and specifications">
                    <span>Details &amp; Changelog</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="chevron-icon">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        `;

        // Handle image error fallback
        const iconEl = card.querySelector<HTMLImageElement>('.app-icon-squircle');
        if (iconEl) {
            iconEl.onerror = () => {
                if (app.name && app.name.toLowerCase().includes('kace')) {
                    iconEl.src = 'icons/dtkace.png';
                } else if (app.bundleIdentifier === 'com.google.ios.youtubemusic') {
                    iconEl.src = 'icons/dtmusicultimate.png';
                } else if (app.iconURL && iconEl.src !== app.iconURL) {
                    iconEl.src = app.iconURL;
                } else {
                    iconEl.src = 'icons/dtlite.png';
                }
            };
        }

        // Details button handler
        const detailsBtn = card.querySelector('.details-link-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onSelect();
            });
        }

        // Header click opens details
        const headerLeft = card.querySelector('.card-header-left');
        if (headerLeft) {
            headerLeft.addEventListener('click', onSelect);
            headerLeft.addEventListener('keydown', (e: Event) => {
                const keyEvent = e as KeyboardEvent;
                if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                    e.preventDefault();
                    onSelect();
                }
            });
        }

        // Thumbnail click opens lightbox
        const carousel = card.querySelector<HTMLElement>('.app-screenshot-carousel');
        if (carousel) {
            enableHorizontalScroll(carousel);
        }

        const slides = card.querySelectorAll<HTMLElement>('.screenshot-slide');
        slides.forEach((slide) => {
            const idx = parseInt(slide.getAttribute('data-idx') || '0', 10);
            const triggerLightbox = (e: Event) => {
                e.stopPropagation();
                if (onOpenLightbox && screenshotUrls.length > 0) {
                    onOpenLightbox(screenshotUrls, idx, app.name);
                } else {
                    onSelect();
                }
            };
            slide.addEventListener('click', triggerLightbox);
            slide.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerLightbox(e);
                }
            });
        });

        return card;
    }
}
