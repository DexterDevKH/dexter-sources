import type { SourceManifest, SourceKey } from '../types';
import { FALLBACK_MANIFESTS } from '../constants';
import { store } from '../state/store';

export class ManifestService {
    private static cache: Map<string, SourceManifest> = new Map();

    public static async loadManifest(sourceKey: SourceKey, sourceUrl: string): Promise<SourceManifest> {
        // Check in-memory cache first
        if (this.cache.has(sourceUrl)) {
            const cached = this.cache.get(sourceUrl)!;
            store.setState({ manifest: cached, currentSourceKey: sourceKey, currentSourceUrl: sourceUrl });
            // Revalidate in background
            this.fetchRemote(sourceKey, sourceUrl).catch(() => {});
            return cached;
        }

        // Use fallback as initial base
        const fallback = sourceKey === 'dtkace' ? FALLBACK_MANIFESTS.dtkace : FALLBACK_MANIFESTS.main;
        store.setState({ manifest: fallback, currentSourceKey: sourceKey, currentSourceUrl: sourceUrl });

        return this.fetchRemote(sourceKey, sourceUrl);
    }

    private static async fetchRemote(sourceKey: SourceKey, sourceUrl: string): Promise<SourceManifest> {
        const isWeb = window.location.protocol === 'http:' || window.location.protocol === 'https:';
        if (!isWeb) {
            return store.getState().manifest;
        }

        const cacheBustUrl = `${sourceUrl}${sourceUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);

        try {
            const res = await fetch(cacheBustUrl, {
                signal: controller.signal,
                headers: { Accept: 'application/json' }
            });
            clearTimeout(timeout);

            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }

            const data = (await res.json()) as SourceManifest;

            if (data && Array.isArray(data.apps) && data.apps.length > 0) {
                this.cache.set(sourceUrl, data);
                const current = store.getState().manifest;
                if (!this.isIdentical(current, data)) {
                    store.setState({ manifest: data });
                }
                return data;
            }
        } catch (err) {
            clearTimeout(timeout);
            console.warn(`[ManifestService] Could not fetch remote manifest for ${sourceUrl}:`, err);
        }

        return store.getState().manifest;
    }

    private static isIdentical(a: SourceManifest, b: SourceManifest): boolean {
        if (!a || !b) return false;
        const appsA = a.apps || [];
        const appsB = b.apps || [];
        if (appsA.length !== appsB.length) return false;

        for (let i = 0; i < appsA.length; i++) {
            const appA = appsA[i];
            const appB = appsB[i];
            if (appA.bundleIdentifier !== appB.bundleIdentifier) return false;

            const verA = appA.versions?.[0]?.version || appA.version;
            const verB = appB.versions?.[0]?.version || appB.version;
            if (verA !== verB) return false;

            const dlA = appA.versions?.[0]?.downloadURL || appA.downloadURL;
            const dlB = appB.versions?.[0]?.downloadURL || appB.downloadURL;
            if (dlA !== dlB) return false;
        }

        const newsA = a.news?.[0]?.title || '';
        const newsB = b.news?.[0]?.title || '';
        return newsA === newsB;
    }
}

