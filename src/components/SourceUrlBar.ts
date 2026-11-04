import { store } from '../state/store';
import { UrlService } from '../services/urlService';
import { Toast } from './Toast';

export class SourceUrlBar {
    public static init(): void {
        const urlCode = document.getElementById('sourceUrlCode');
        const viewJsonBtn = document.getElementById('viewJsonBtn') as HTMLAnchorElement | null;
        const copyBtn = document.getElementById('copyUrlBtn');
        const copyText = document.getElementById('copyBtnText');

        const syncUrl = (url: string): void => {
            if (urlCode) {
                urlCode.textContent = url;
            }
            if (viewJsonBtn) {
                const key = store.getState().currentSourceKey;
                viewJsonBtn.href = key === 'dtkace' ? 'dtkace.json' : 'sources.json';
            }
        };

        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const url = store.getState().currentSourceUrl;
                const success = await UrlService.copyToClipboard(url);

                if (success) {
                    if (copyText) {
                        const original = copyText.textContent || 'Copy';
                        copyText.textContent = 'Copied!';
                        setTimeout(() => {
                            copyText.textContent = original;
                        }, 2000);
                    }
                    Toast.show('Source URL copied to clipboard!');
                } else {
                    Toast.show('Could not copy automatically');
                }
            });
        }

        store.select(
            (s) => s.currentSourceUrl,
            (url) => syncUrl(url)
        );

        syncUrl(store.getState().currentSourceUrl);
    }
}

