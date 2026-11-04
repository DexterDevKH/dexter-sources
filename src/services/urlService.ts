import type { SideloadClientKey, SourceKey } from '../types';
import { SCHEMES, DEFAULT_SOURCE_URL, DTKACE_SOURCE_URL } from '../constants';

export class UrlService {
    private static params = new URLSearchParams(window.location.search);

    public static getParam(key: string): string | null {
        return this.params.get(key);
    }

    public static getInitialSource(): { key: SourceKey; url: string } {
        const customUrl = this.params.get('url');
        if (customUrl) {
            return { key: 'custom', url: customUrl.trim() };
        }

        const sourceParam = (this.params.get('source') || '').toLowerCase().trim();
        if (sourceParam === 'dtkace') {
            return { key: 'dtkace', url: DTKACE_SOURCE_URL };
        }

        return { key: 'main', url: DEFAULT_SOURCE_URL };
    }

    public static getExcludedClients(): Set<string> {
        const exclude = this.params.get('exclude') || '';
        return new Set(
            exclude
                .split(',')
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean)
        );
    }

    public static getTargetAppId(): string | null {
        return this.params.get('app');
    }

    public static handleAutoRedirect(sourceUrl: string): boolean {
        const r = (this.params.get('r') || '').toLowerCase().trim() as SideloadClientKey;
        if (!r || !SCHEMES[r]) return false;

        const schemeBuilder = SCHEMES[r];
        const deepLink = schemeBuilder(sourceUrl);

        // Strip 'r' from URL history to prevent back-button loops
        const cleanParams = new URLSearchParams(window.location.search);
        cleanParams.delete('r');
        const search = cleanParams.toString();
        const cleanUrl = window.location.pathname + (search ? `?${search}` : '') + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);

        // Immediate redirection
        window.location.assign(deepLink);
        return true;
    }

    public static updateSourceInUrl(sourceKey: SourceKey, customUrl?: string): void {
        const newParams = new URLSearchParams(window.location.search);
        if (sourceKey === 'dtkace') {
            newParams.set('source', 'dtkace');
            newParams.delete('url');
        } else if (sourceKey === 'custom' && customUrl) {
            newParams.set('url', customUrl);
            newParams.delete('source');
        } else {
            newParams.delete('source');
            newParams.delete('url');
        }

        const search = newParams.toString();
        const newUrl = window.location.pathname + (search ? `?${search}` : '') + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }

    public static async copyToClipboard(text: string): Promise<boolean> {
        if (!text) return false;

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                // fallback to execCommand below
            }
        }

        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const success = document.execCommand('copy');
            document.body.removeChild(ta);
            return success;
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            return false;
        }
    }
}

