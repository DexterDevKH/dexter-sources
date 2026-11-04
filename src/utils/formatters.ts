import type { ManifestApp } from '../types';
import { LOCAL_APP_ICONS } from '../constants';

/**
 * Format bytes into readable human-friendly size (e.g. "144.15 MB")
 */
export function formatBytes(bytes?: number): string {
    if (!bytes || typeof bytes !== 'number' || bytes <= 0) return 'Unknown Size';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1000) {
        return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
}

/**
 * Format ISO or standard date string into readable English date
 */
export function formatDate(dateStr?: string): string {
    if (!dateStr) return 'Latest Release';
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateStr;
    }
}

/**
 * Escape HTML special chars to prevent XSS
 */
export function escapeHtml(str?: string): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Get category classification for an application
 */
export function getAppCategory(app: ManifestApp): 'entertainment' | 'music' {
    const id = (app.bundleIdentifier || '').toLowerCase();
    const name = (app.name || '').toLowerCase();
    if (id.includes('youtubemusic') || name.includes('music')) {
        return 'music';
    }
    return 'entertainment';
}

/**
 * Resolve app icon URL with resilient local fallbacks
 */
export function getAppIconUrl(app: ManifestApp, currentSourceKey: string): string {
    const id = app.bundleIdentifier || '';
    if (currentSourceKey === 'dtkace' && id === 'com.google.ios.youtube') {
        return 'icons/dtkace.png';
    }
    if (LOCAL_APP_ICONS[id]) {
        return LOCAL_APP_ICONS[id];
    }
    return app.iconURL || 'icons/profile.png';
}

