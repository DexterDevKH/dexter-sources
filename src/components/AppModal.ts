import type { ManifestApp } from '../types';
import { formatBytes, formatDate, getAppIconUrl } from '../utils/formatters';
import { enableHorizontalScroll } from '../utils/scrollHelper';
import { store } from '../state/store';
import { UrlService } from '../services/urlService';
import { Toast } from './Toast';

export class AppModal {
    private static modal: HTMLElement | null = null;
    private static onOpenLightboxCallback: ((urls: string[], index: number, title: string) => void) | null = null;

    public static init(onOpenLightbox: (urls: string[], index: number, title: string) => void): void {
        this.modal = document.getElementById('appDetailsModal');
        this.onOpenLightboxCallback = onOpenLightbox;

        if (!this.modal) return;

        const closeBtn = document.getElementById('appModalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    public static open(app: ManifestApp): void {
        if (!this.modal) {
            this.modal = document.getElementById('appDetailsModal');
        }
        if (!this.modal) return;

        const currentSourceKey = store.getState().currentSourceKey;
        const latestVer = Array.isArray(app.versions) && app.versions[0] ? app.versions[0] : app;
        const versionStr = 'version' in latestVer && latestVer.version ? latestVer.version : (app.version || 'Latest');
        const downloadUrl = 'downloadURL' in latestVer && latestVer.downloadURL ? latestVer.downloadURL : (app.downloadURL || '#');
        const sizeFormatted = formatBytes('size' in latestVer && latestVer.size ? latestVer.size : (app.size || 0));
        const verDate = 'date' in latestVer ? latestVer.date : undefined;
        const formattedDate = formatDate(verDate);

        // Header info
        const detailIcon = document.getElementById('detailAppIcon') as HTMLImageElement | null;
        if (detailIcon) {
            detailIcon.src = getAppIconUrl(app, currentSourceKey);
            detailIcon.alt = app.name || 'App Icon';
            detailIcon.onerror = () => {
                if (app.name && app.name.toLowerCase().includes('kace')) {
                    detailIcon.src = 'icons/dtkace.png';
                } else if (app.bundleIdentifier === 'com.google.ios.youtubemusic') {
                    detailIcon.src = 'icons/dtmusicultimate.png';
                } else if (app.iconURL && detailIcon.src !== app.iconURL) {
                    detailIcon.src = app.iconURL;
                } else {
                    detailIcon.src = 'icons/dtlite.png';
                }
            };
        }

        const titleEl = document.getElementById('detailAppTitle');
        const subEl = document.getElementById('detailAppSubtitle');
        const bundleEl = document.getElementById('detailBundleId');
        const verEl = document.getElementById('detailVersion');

        if (titleEl) titleEl.textContent = app.name || 'Application';
        if (subEl) subEl.textContent = app.subtitle || '';
        if (bundleEl) bundleEl.textContent = app.bundleIdentifier || '';
        if (verEl) verEl.textContent = `v${versionStr}`;

        // Action buttons
        const downloadBtn = document.getElementById('detailDownloadBtn') as HTMLAnchorElement | null;
        if (downloadBtn) {
            downloadBtn.href = downloadUrl;
        }

        const copyIpaBtn = document.getElementById('detailCopyIpaBtn');
        if (copyIpaBtn) {
            copyIpaBtn.onclick = async () => {
                await UrlService.copyToClipboard(downloadUrl);
                Toast.show('Direct IPA Download link copied!');
            };
        }

        // About Description
        const descEl = document.getElementById('detailDescription');
        if (descEl) {
            descEl.textContent = app.localizedDescription || 'No detailed description provided.';
        }

        // Screenshots Carousel
        const screenshotsSection = document.getElementById('detailScreenshotsSection');
        const screenshotsContainer = document.getElementById('detailScreenshotsContainer');
        if (screenshotsSection && screenshotsContainer) {
            screenshotsContainer.replaceChildren();
            let rawList: any[] = [];
            if (Array.isArray(app.screenshots)) {
                rawList = app.screenshots;
            } else if (app.screenshots && typeof app.screenshots === 'object') {
                if (Array.isArray(app.screenshots.iphone) && app.screenshots.iphone.length > 0) {
                    rawList = app.screenshots.iphone;
                } else if (Array.isArray(app.screenshots.ipad) && app.screenshots.ipad.length > 0) {
                    rawList = app.screenshots.ipad;
                }
            }
            const urlList = rawList
                .map((s) => (typeof s === 'string' ? s : s?.imageURL ? s.imageURL : ''))
                .filter(Boolean);

            if (urlList.length > 0) {
                urlList.forEach((url, idx) => {
                    const img = document.createElement('img');
                    img.className = 'detail-screenshot-img';
                    img.src = url;
                    img.alt = `${app.name} Screenshot ${idx + 1}`;
                    img.title = 'Click to preview full screenshot';
                    img.loading = 'lazy';
                    img.setAttribute('role', 'button');
                    img.setAttribute('tabindex', '0');
                    img.setAttribute('aria-label', `Preview screenshot ${idx + 1} of ${urlList.length}`);

                    const openViewer = () => {
                        this.onOpenLightboxCallback?.(urlList, idx, app.name);
                    };

                    img.addEventListener('click', openViewer);
                    img.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openViewer();
                        }
                    });

                    screenshotsContainer.appendChild(img);
                });
                enableHorizontalScroll(screenshotsContainer);
                screenshotsSection.classList.remove('hidden');
            } else {
                screenshotsSection.classList.add('hidden');
            }
        }

        // Tech specs
        const specBundle = document.getElementById('specBundleId');
        const specDev = document.getElementById('specDev');
        const specSize = document.getElementById('specSize');
        const specDate = document.getElementById('specDate');

        if (specBundle) specBundle.textContent = app.bundleIdentifier || '-';
        if (specDev) specDev.textContent = app.developerName || 'DexterDevKH';
        if (specSize) specSize.textContent = sizeFormatted;
        if (specDate) specDate.textContent = formattedDate;

        // Changelogs
        const changelogList = document.getElementById('detailChangelogList');
        if (changelogList) {
            changelogList.replaceChildren();
            const versions = Array.isArray(app.versions) ? app.versions : [app];

            versions.forEach((ver) => {
                const item = document.createElement('div');
                item.className = 'changelog-entry';

                const header = document.createElement('div');
                header.className = 'changelog-header';

                const verSpan = document.createElement('span');
                verSpan.className = 'changelog-version';
                verSpan.textContent = `Version ${ver.version || 'Update'}`;

                const dateSpan = document.createElement('span');
                dateSpan.className = 'changelog-date';
                const verDateStr = 'date' in ver ? ver.date : undefined;
                dateSpan.textContent = formatDate(verDateStr);

                header.appendChild(verSpan);
                header.appendChild(dateSpan);

                const body = document.createElement('div');
                body.className = 'changelog-body';
                body.textContent = ver.localizedDescription || 'Maintenance release and performance optimizations.';

                item.appendChild(header);
                item.appendChild(body);
                changelogList.appendChild(item);
            });
        }

        this.modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    public static close(): void {
        this.modal?.classList.add('hidden');
        setTimeout(() => {
            if (!document.querySelector('.modal-backdrop:not(.hidden)')) {
                document.body.classList.remove('modal-open');
            }
        }, 10);
    }

    public static isOpen(): boolean {
        return !!this.modal && !this.modal.classList.contains('hidden');
    }
}
