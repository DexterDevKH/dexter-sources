import type { SourceManifest, SideloadClientKey } from '../types';

export const DEFAULT_SOURCE_URL = 'https://dexterdevkh.github.io/dexter-sources/sources.json';
export const DTKACE_SOURCE_URL = 'https://dexterdevkh.github.io/dexter-sources/dtkace.json';
export const PORTAL_URL = 'https://dexterdevkh.github.io/dexter-sources/';

export const SOURCE_PRESETS: Record<string, { url: string; label: string; tabId: string }> = {
    main: {
        url: DEFAULT_SOURCE_URL,
        label: 'DTLite Plus & Music',
        tabId: 'tabSourceMain'
    },
    dtkace: {
        url: DTKACE_SOURCE_URL,
        label: 'DTKACE Plus',
        tabId: 'tabSourceDtkace'
    }
};

export const SCHEMES: Record<SideloadClientKey, (url: string) => string> = {
    sidestore: (url: string) => `sidestore://source?url=${encodeURIComponent(url)}`,
    altstore: (url: string) => `altstore://source?url=${encodeURIComponent(url)}`,
    'altstore-classic': (url: string) => `altstore-classic://source?url=${encodeURIComponent(url)}`,
    feather: (url: string) => `feather://source/${url}`,
    livecontainer: (url: string) => `livecontainer://source?url=${encodeURIComponent(url)}`,
    trollapps: (url: string) => `trollapps://add?url=${encodeURIComponent(url)}`,
    scarlet: (url: string) => `scarlet://source?url=${encodeURIComponent(url)}`,
    esign: (url: string) => `esign://source?url=${encodeURIComponent(url)}`
};

export const LOCAL_APP_ICONS: Record<string, string> = {
    'com.google.ios.youtube': 'icons/dtlite.png',
    'com.google.ios.youtube.dtkace': 'icons/dtkace.png',
    'com.google.ios.youtubemusic': 'icons/dtmusicultimate.png'
};

export const FALLBACK_MANIFESTS: Record<'main' | 'dtkace', SourceManifest> = {
    main: {
        name: 'DexterDevKH Apps',
        identifier: 'com.dexterdevkh.source',
        website: DEFAULT_SOURCE_URL,
        subtitle: 'Official SideStore, Feather, and AltStore Source.',
        description: 'High-performance curated iOS apps including DTLite Plus and DexTube Music.',
        tintColor: '#007AFF',
        iconURL: 'icons/profile.png',
        headerURL: 'icons/profile.png',
        news: [
            {
                title: 'DTLite Plus & DexTube Music Synchronized',
                identifier: 'release-sync-v21',
                caption: 'Synchronized with upstream release builds featuring pure dark mode, PiP, and SponsorBlock.',
                date: '2026-11-03',
                tintColor: '#6366f1'
            }
        ],
        apps: [
            {
                name: 'DTLite Plus',
                bundleIdentifier: 'com.google.ios.youtube',
                developerName: 'DexterDevKH',
                subtitle: 'Enhanced YouTube client with ad-blocking & background play',
                localizedDescription: 'Official iOS release of DTLite Plus featuring ad-blocking, background playback, and SponsorBlock.',
                iconURL: 'icons/dtlite.png',
                tintColor: '#007AFF',
                size: 151151311,
                screenshots: {
                    iphone: [
                        { width: 1242, height: 2556, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr1.jpg' },
                        { width: 1242, height: 2556, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr2.jpg' },
                        { width: 1242, height: 2556, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr3.jpg' },
                        { width: 1242, height: 2556, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr4.jpg' },
                        { width: 1242, height: 2556, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr5.jpg' },
                        { width: 1242, height: 2556, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr6.jpg' }
                    ]
                },
                appPermissions: {
                    entitlements: [],
                    privacy: {
                        NSBackgroundAudioUsageDescription: 'Allows audio and video playback in background and Picture-in-Picture.',
                        NSBackgroundFetchUsageDescription: 'Allows background updates and download synchronization.'
                    }
                },
                versions: [
                    {
                        version: '21.44.4',
                        date: '2026-11-03',
                        localizedDescription: 'Version 21.44.4 release featuring ad-blocking and SponsorBlock.',
                        downloadURL: 'https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0-21.44.4/DTLitePlus_v6.0_21.44.4.ipa',
                        size: 151151311,
                        minOSVersion: '16.0'
                    }
                ]
            },
            {
                name: 'DexTube Music',
                bundleIdentifier: 'com.google.ios.youtubemusic',
                developerName: 'DexterDevKH',
                subtitle: 'High-fidelity music streaming, background audio & lyrics',
                localizedDescription: 'Official iOS release of DTMusicUltimate (DexTube Music) featuring background audio, ad-free listening, and lossless presets.',
                iconURL: 'icons/dtmusicultimate.png',
                tintColor: '#FF2D55',
                size: 107672160,
                screenshots: {
                    iphone: [
                        { width: 1000, height: 2060, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn1.png' },
                        { width: 1000, height: 2060, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn2.png' },
                        { width: 1000, height: 2060, imageURL: 'https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn3.png' }
                    ]
                },
                appPermissions: {
                    entitlements: [],
                    privacy: {
                        NSBackgroundAudioUsageDescription: 'Enables uninterrupted high-fidelity background music and lock screen playback controls.',
                        NSBackgroundFetchUsageDescription: 'Enables background sync and offline cache verification.'
                    }
                },
                versions: [
                    {
                        version: '9.43.2',
                        date: '2026-10-26',
                        localizedDescription: 'Version 9.43.2 release.',
                        downloadURL: 'https://github.com/DexterDevKH/DTMusicUltimate/releases/download/dtm-9.43.2/DTMusicUltimate_9.43.2.ipa',
                        size: 107672160,
                        minOSVersion: '16.0'
                    }
                ]
            }
        ]
    },
    dtkace: {
        name: 'DexterDevKH Apps (DTKACE)',
        identifier: 'com.dexterdevkh.dtkace.source',
        website: DTKACE_SOURCE_URL,
        subtitle: 'Official SideStore, Feather, and AltStore Source for DTKACE Plus.',
        description: 'High-performance curated iOS app: DTKACE Plus with YTKACE tweak engine & 12 modular extensions.',
        tintColor: '#E36678',
        iconURL: 'icons/dtkace.png',
        headerURL: 'icons/profile.png',
        news: [
            {
                title: 'DTKACE Plus Source Active',
                identifier: 'dtkace-active',
                caption: 'Dedicated source manifest featuring YTKACE tweak engine and 12 extensions.',
                date: '2026-11-03',
                tintColor: '#E36678'
            }
        ],
        apps: [
            {
                name: 'DTKACE Plus',
                bundleIdentifier: 'com.google.ios.youtube',
                developerName: 'DexterDevKH',
                subtitle: 'Enhanced YouTube with YTKACE tweak engine & 12 modular extensions',
                localizedDescription: 'Official iOS release of DTKACE Plus featuring YTKACE, up to 4K media downloads, Picture-in-Picture, SponsorBlock, dislike restoration, and pure dark OLED mode.',
                iconURL: 'icons/dtkace.png',
                tintColor: '#E36678',
                size: 134704274,
                screenshots: {
                    iphone: [
                        { width: 923, height: 2000, imageURL: 'https://raw.githubusercontent.com/itzzace/ytkace/main/screenshots/source/glass-home.jpg' },
                        { width: 923, height: 2000, imageURL: 'https://raw.githubusercontent.com/itzzace/ytkace/main/screenshots/source/video-player.png' },
                        { width: 923, height: 2000, imageURL: 'https://raw.githubusercontent.com/itzzace/ytkace/main/screenshots/source/download-library.jpg' }
                    ]
                },
                appPermissions: {
                    entitlements: [],
                    privacy: {
                        NSBackgroundAudioUsageDescription: 'Enables uninterrupted background video and audio playback and lock screen controls.',
                        NSBackgroundFetchUsageDescription: 'Enables background asset refresh and download verification.'
                    }
                },
                versions: [
                    {
                        version: '21.44.4',
                        date: '2026-11-03',
                        localizedDescription: 'Version 21.44.4 release featuring YTKACE tweak engine.',
                        downloadURL: 'https://github.com/DexterDevKH/DTKACE/releases/download/dtk-v21.44.4/DTKACEPlus_v21.44.4.ipa',
                        size: 134704274,
                        minOSVersion: '16.0'
                    }
                ]
            }
        ]
    }
};

