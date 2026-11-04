/**
 * DexterDevKH Apps — Type Definitions
 * Complete schema definitions for iOS Sideloading Source Manifests,
 * UI state, and client URL schemes.
 */

export interface ManifestAppScreenshot {
    width: number;
    height: number;
    imageURL: string;
}

export interface ManifestAppPermissions {
    entitlements?: string[];
    privacy?: Record<string, string>;
}

export interface ManifestAppVersion {
    version: string;
    date: string;
    localizedDescription?: string;
    downloadURL: string;
    size: number;
    minOSVersion?: string;
    sha256?: string;
}

export interface ManifestApp {
    name: string;
    bundleIdentifier: string;
    developerName: string;
    subtitle?: string;
    localizedDescription?: string;
    iconURL?: string;
    tintColor?: string;
    size?: number;
    screenshots?: {
        iphone?: ManifestAppScreenshot[];
        ipad?: ManifestAppScreenshot[];
    };
    appPermissions?: ManifestAppPermissions;
    versions?: ManifestAppVersion[];
    // Flattened fallbacks
    version?: string;
    downloadURL?: string;
    category?: string;
}

export interface ManifestNews {
    title: string;
    identifier: string;
    caption?: string;
    date?: string;
    tintColor?: string;
    imageURL?: string;
    url?: string;
    appID?: string;
}

export interface SourceManifest {
    name: string;
    identifier: string;
    website?: string;
    subtitle?: string;
    description?: string;
    tintColor?: string;
    iconURL?: string;
    headerURL?: string;
    apps: ManifestApp[];
    news?: ManifestNews[];
}

export type SourceKey = 'main' | 'dtkace' | 'custom';

export type SideloadClientKey =
    | 'sidestore'
    | 'altstore'
    | 'altstore-classic'
    | 'feather'
    | 'livecontainer'
    | 'trollapps'
    | 'scarlet'
    | 'esign';

export type QrTargetKey = 'sidestore' | 'altstore' | 'livecontainer' | 'portal';

export type ThemeMode = 'dark' | 'light';

export type CategoryFilter = 'all' | 'entertainment' | 'music';

export interface AppState {
    currentSourceKey: SourceKey;
    currentSourceUrl: string;
    manifest: SourceManifest;
    activeCategory: CategoryFilter;
    searchQuery: string;
    theme: ThemeMode;
    activeQrTarget: QrTargetKey;
    selectedApp: ManifestApp | null;
    lightboxImages: string[];
    lightboxIndex: number;
    isNewsDismissed: boolean;
}

