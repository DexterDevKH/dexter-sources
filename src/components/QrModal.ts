import type { QrTargetKey } from '../types';
import { SCHEMES, PORTAL_URL } from '../constants';
import { store } from '../state/store';
import { renderQrToCanvas } from '../utils/qrcode';

export class QrModal {
    private static modal: HTMLElement | null = null;
    private static canvas: HTMLCanvasElement | null = null;
    private static captionText: HTMLElement | null = null;
    private static tabs: NodeListOf<HTMLButtonElement> | null = null;

    public static init(): void {
        this.modal = document.getElementById('qrModal');
        this.canvas = document.getElementById('qrCanvas') as HTMLCanvasElement | null;
        this.captionText = document.getElementById('qrCaptionText');
        this.tabs = document.querySelectorAll<HTMLButtonElement>('#qrTargetTabs .qr-tab');

        const closeBtn = document.getElementById('qrModalCloseBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        if (this.tabs) {
            this.tabs.forEach((tab) => {
                tab.addEventListener('click', () => {
                    const target = (tab.getAttribute('data-target') || 'sidestore') as QrTargetKey;
                    store.setState({ activeQrTarget: target });
                });
            });
        }

        // Close on Escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Re-render QR code on target change or source change
        store.select(
            (s) => `${s.activeQrTarget}:${s.currentSourceUrl}:${s.theme}`,
            () => {
                if (this.isOpen()) {
                    this.renderQr();
                }
            }
        );

        // Sync tab active styling
        store.select(
            (s) => s.activeQrTarget,
            (activeTarget) => {
                this.tabs?.forEach((tab) => {
                    tab.classList.toggle('active', tab.getAttribute('data-target') === activeTarget);
                });
            }
        );
    }

    public static open(): void {
        if (!this.modal) {
            this.modal = document.getElementById('qrModal');
        }
        this.modal?.classList.remove('hidden');
        document.body.classList.add('modal-open');
        this.renderQr();
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

    private static renderQr(): void {
        if (!this.canvas) return;

        const state = store.getState();
        const sourceUrl = state.currentSourceUrl;
        const target = state.activeQrTarget;

        let targetUrl = sourceUrl;
        let caption = 'SideStore Source';

        switch (target) {
            case 'sidestore':
                targetUrl = SCHEMES.sidestore(sourceUrl);
                caption = 'SideStore Source';
                break;
            case 'altstore':
                targetUrl = SCHEMES.altstore(sourceUrl);
                caption = 'AltStore Source';
                break;
            case 'livecontainer':
                targetUrl = SCHEMES.livecontainer(sourceUrl);
                caption = 'LiveContainer Source';
                break;
            case 'portal':
                targetUrl = state.currentSourceKey === 'dtkace' ? `${PORTAL_URL}?source=dtkace` : PORTAL_URL;
                caption = 'Web Portal';
                break;
        }

        renderQrToCanvas(this.canvas, targetUrl, {
            margin: 16,
            foreground: '#0f172a',
            background: '#ffffff'
        });

        if (this.captionText) {
            this.captionText.innerHTML = `Scans directly to: <code>${caption}</code>`;
        }
    }
}

