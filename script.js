/**
 * DexterDevKH Apps — Source Portal Script
 * ========================================
 * Apple iOS 18 & VisionOS Liquid Glass Controller
 * Supports deep-linking, offline fallback, QR generator,
 * search & category filtering, and modal drawer management.
 */

(function () {
    "use strict";

    const DEFAULT_SOURCE_URL = "https://dexterdevkh.github.io/dexter-sources/sources.json";

    // Supported iOS Sideloading Client URL Schemes
    const SCHEMES = {
        sidestore: (url) => `sidestore://source?url=${encodeURIComponent(url)}`,
        altstore: (url) => `altstore://source?url=${encodeURIComponent(url)}`,
        "altstore-classic": (url) => `altstore-classic://source?url=${encodeURIComponent(url)}`,
        feather: (url) => `feather://source/${url}`,
        livecontainer: (url) => `livecontainer://source?url=${encodeURIComponent(url)}`,
        trollapps: (url) => `trollapps://add?url=${encodeURIComponent(url)}`,
        scarlet: (url) => `scarlet://source?url=${encodeURIComponent(url)}`,
        esign: (url) => `esign://source?url=${encodeURIComponent(url)}`
    };

    // Fallback source manifest for offline or direct file:// viewing
    const FALLBACK_MANIFEST = {
        name: "DexterDevKH Apps",
        identifier: "com.dexterdevkh.source",
        website: "https://dexterdevkh.github.io/dexter-sources/",
        subtitle: "Official SideStore, Feather, and AltStore Source.",
        description: "High-performance curated iOS apps including DexTube and DexTube Music.",
        tintColor: "#007AFF",
        iconURL: "https://avatars.githubusercontent.com/u/274127037?v=4",
        headerURL: "https://avatars.githubusercontent.com/u/274127037?v=4",
        apps: [
            {
                name: "DexTube",
                bundleIdentifier: "com.google.ios.youtube",
                developerName: "DexterDevKH",
                subtitle: "Enhanced YouTube client with ad-blocking & background play",
                localizedDescription: "Official iOS release of DTLite (DexTube) featuring ad-blocking, background playback, and SponsorBlock.",
                iconURL: "icons/dtlite.png",
                tintColor: "#007AFF",
                size: 149422771,
                screenshots: {
                    iphone: [
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr1.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr2.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr3.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr4.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr5.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr6.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr7.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr8.jpg" },
                        { width: 1242, height: 2556, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTLite/main/Resources/scr9.jpg" }
                    ]
                },
                appPermissions: {
                    entitlements: [],
                    privacy: {
                        NSBackgroundAudioUsageDescription: "Allows audio and video playback in background and Picture-in-Picture.",
                        NSBackgroundFetchUsageDescription: "Allows background updates and download synchronization."
                    }
                },
                versions: [
                    {
                        version: "21.42.4",
                        date: "2026-10-22",
                        localizedDescription: "Version 21.42.4 release.",
                        downloadURL: "https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0.b2-21.42.4/DexTubePlus_v6.0.b2_21.42.4.ipa",
                        size: 149422771,
                        minOSVersion: "14.0"
                    },
                    {
                        version: "21.41.5",
                        date: "2026-10-17",
                        localizedDescription: "Version 21.41.5 release.",
                        downloadURL: "https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0.b2-21.41.5/DexTubePlus_v6.0.b2_21.41.5.ipa",
                        size: 148605386,
                        minOSVersion: "14.0"
                    },
                    {
                        version: "21.40.5",
                        date: "2026-10-06",
                        localizedDescription: "Version 21.40.5 release.",
                        downloadURL: "https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0.b2-21.40.5/DexTubePlus_v6.0.b2_21.40.5.ipa",
                        size: 147834744,
                        minOSVersion: "14.0"
                    }
                ]
            },
            {
                name: "DexTube Music",
                bundleIdentifier: "com.google.ios.youtubemusic",
                developerName: "DexterDevKH",
                subtitle: "High-fidelity music streaming, background audio & lyrics",
                localizedDescription: "Official iOS release of DTMusicUltimate (DexTube Music) featuring background audio, ad-free listening, and lossless presets.",
                iconURL: "icons/dtmusicultimate.png",
                tintColor: "#FF2D55",
                size: 107274691,
                screenshots: {
                    iphone: [
                        { width: 1000, height: 2060, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn1.png" },
                        { width: 1000, height: 2060, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn2.png" },
                        { width: 1000, height: 2060, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn3.png" },
                        { width: 1000, height: 2060, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn4.png" },
                        { width: 1000, height: 2060, imageURL: "https://raw.githubusercontent.com/DexterDevKH/DTMusicUltimate/main/Resources/scrn5.png" }
                    ]
                },
                appPermissions: {
                    entitlements: [],
                    privacy: {
                        NSBackgroundAudioUsageDescription: "Enables uninterrupted high-fidelity background music and lock screen playback controls.",
                        NSBackgroundFetchUsageDescription: "Enables background sync and offline cache verification."
                    }
                },
                versions: [
                    {
                        version: "9.42.2",
                        date: "2026-10-19",
                        localizedDescription: "Version 9.42.2 release.",
                        downloadURL: "https://github.com/DexterDevKH/DTMusicUltimate/releases/download/dtm-9.42.2/DTMusicUltimate_9.42.2.ipa",
                        size: 107274691,
                        minOSVersion: "14.0"
                    },
                    {
                        version: "9.41.2",
                        date: "2026-10-18",
                        localizedDescription: "Version 9.41.2 release.",
                        downloadURL: "https://github.com/DexterDevKH/DTMusicUltimate/releases/download/dtm-9.41.2/DTMusicUltimate_9.41.2.ipa",
                        size: 107008594,
                        minOSVersion: "14.0"
                    },
                    {
                        version: "9.40.2",
                        date: "2026-10-11",
                        localizedDescription: "Version 9.40.2 release.",
                        downloadURL: "https://github.com/DexterDevKH/DTMusicUltimate/releases/download/dtm-9.40.2/DTMusicUltimate_9.40.2.ipa",
                        size: 106696986,
                        minOSVersion: "14.0"
                    }
                ]
            }
        ],
        news: [
            {
                title: "DexTube v21.42.4 Released",
                identifier: "release-com-google-ios-youtube-21-42-4",
                caption: "Version 21.42.4 is now available with the latest features, enhancements, and iOS 18 fixes.",
                tintColor: "#007AFF",
                imageURL: "icons/dtlite.png",
                url: "https://github.com/DexterDevKH/DTLite/releases/tag/ytp-v6.0.b2-21.42.4",
                date: "2026-10-22",
                notify: true
            },
            {
                title: "DexTube Music v9.42.2 Released",
                identifier: "release-com-google-ios-youtubemusic-9-42-2",
                caption: "Version 9.42.2 is now available with the latest features, enhancements, and iOS 18 fixes.",
                tintColor: "#FF2D55",
                imageURL: "icons/dtmusicultimate.png",
                url: "https://github.com/DexterDevKH/DTMusicUltimate/releases/tag/dtm-9.42.2",
                date: "2026-10-19",
                notify: true
            }
        ]
    };

    // Local icons map for flawless offline & web viewing
    const LOCAL_APP_ICONS = {
        "com.google.ios.youtube": "icons/dtlite.png",
        "com.google.ios.youtubemusic": "icons/dtmusicultimate.png"
    };

    function getAppIconUrl(app) {
        if (!app) return "icons/dtlite.png";
        if (app.bundleIdentifier && LOCAL_APP_ICONS[app.bundleIdentifier]) {
            return LOCAL_APP_ICONS[app.bundleIdentifier];
        }
        return app.iconURL || "icons/dtlite.png";
    }

    function getAppCategory(app) {
        if (!app) return "";
        if (app.category) return app.category;
        if (app.bundleIdentifier === "com.google.ios.youtubemusic") return "music";
        if (app.bundleIdentifier === "com.google.ios.youtube") return "entertainment";
        return "";
    }

    // State
    const urlParams = new URLSearchParams(window.location.search);
    const sourceUrl = urlParams.get("url") || DEFAULT_SOURCE_URL;
    const redirectKey = (urlParams.get("r") || "").toLowerCase().trim();
    let currentManifest = FALLBACK_MANIFEST;
    let activeFilter = "all";
    let activeSearch = "";
    let activeQrTarget = "sidestore";
    let activeScreenshotsList = [];
    let currentScreenshotIndex = 0;
    let currentScreenshotAppName = "";

    // 1. Instant Deep-link Redirection (?r=sidestore, ?r=feather, etc.)
    if (redirectKey && SCHEMES[redirectKey]) {
        try {
            // Remove ?r= from URL immediately so refreshing or reloading the page never re-triggers the app scheme
            const cleanParams = new URLSearchParams(window.location.search);
            cleanParams.delete("r");
            const cleanSearch = cleanParams.toString();
            const cleanUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + window.location.hash;
            window.history.replaceState(null, "", cleanUrl);

            window.location.href = SCHEMES[redirectKey](sourceUrl);
        } catch (e) {
            console.error("Redirection error:", e);
        }
    }

    // 2. Initialize application after DOM is ready
    window.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initSideloaders();
        initSourceUrlBar();
        initSearchAndFilter();
        initModals();
        initKeyboardShortcuts();

        // Render initial data immediately (prevents any blank/skeleton stutter)
        applyManifest(FALLBACK_MANIFEST);

        // Fetch live manifest asynchronously
        fetchLiveManifest();
    });

    /**
     * Theme Initialization & Toggle
     */
    function initTheme() {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem("dexter-theme");

        if (savedTheme === "light" || savedTheme === "dark") {
            root.setAttribute("data-theme", savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            root.setAttribute("data-theme", "light");
        }

        const toggleBtn = document.getElementById("themeToggleBtn");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
                const next = current === "light" ? "dark" : "light";
                root.setAttribute("data-theme", next);
                localStorage.setItem("dexter-theme", next);
                showToast(`Switched to ${next === "dark" ? "Dark Mode\u00A0🌙" : "Light Mode\u00A0☀️"}`);
            });
        }
    }

    /**
     * Wire up sideloader links & excluded params
     */
    function initSideloaders() {
        const excludeParam = urlParams.get("exclude") || "";
        const excludedSet = new Set(
            excludeParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
        );

        document.querySelectorAll("[data-key]").forEach((btn) => {
            const key = btn.getAttribute("data-key");
            if (excludedSet.has(key)) {
                btn.classList.add("hidden");
                return;
            }

            if (SCHEMES[key]) {
                btn.href = SCHEMES[key](sourceUrl);
            }
        });
    }

    /**
     * Wire up manual source URL copy box
     */
    function initSourceUrlBar() {
        const urlCode = document.getElementById("sourceUrlCode");
        const rawJsonBtn = document.getElementById("viewJsonBtn");
        const copyBtn = document.getElementById("copyUrlBtn");

        if (urlCode) urlCode.textContent = sourceUrl;
        if (rawJsonBtn) rawJsonBtn.href = sourceUrl;

        if (copyBtn) {
            copyBtn.addEventListener("click", async () => {
                const success = await copyToClipboard(sourceUrl);
                if (success) {
                    showToast("Source JSON URL copied to clipboard!");
                    const copyText = document.getElementById("copyBtnText");
                    if (copyText) {
                        copyText.textContent = "Copied!";
                        setTimeout(() => { copyText.textContent = "Copy"; }, 1800);
                    }
                }
            });
        }
    }

    /**
     * Real-time search and category filtering
     */
    function initSearchAndFilter() {
        const searchInput = document.getElementById("appSearchInput");
        const clearBtn = document.getElementById("searchClearBtn");
        const filterTabs = document.getElementById("filterTabs");

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                activeSearch = (e.target.value || "").toLowerCase().trim();
                if (clearBtn) {
                    clearBtn.classList.toggle("hidden", !activeSearch);
                }
                renderApps();
            });
        }

        if (clearBtn && searchInput) {
            clearBtn.addEventListener("click", () => {
                searchInput.value = "";
                activeSearch = "";
                clearBtn.classList.add("hidden");
                searchInput.focus();
                renderApps();
            });
        }

        if (filterTabs) {
            filterTabs.querySelectorAll(".filter-tab").forEach((tab) => {
                tab.addEventListener("click", () => {
                    filterTabs.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
                    tab.classList.add("active");
                    activeFilter = tab.getAttribute("data-filter") || "all";
                    renderApps();
                });
            });
        }
    }

    /**
     * Fetch Live Manifest (Auto-syncs with sources.json)
     */
    function fetchLiveManifest() {
        const isWeb = window.location.protocol === "http:" || window.location.protocol === "https:";
        const targetUrl = urlParams.has("url") ? sourceUrl : (isWeb ? "sources.json" : sourceUrl);

        fetch(targetUrl)
            .then((res) => {
                if (!res.ok) throw new Error("HTTP status " + res.status);
                return res.json();
            })
            .then((data) => {
                if (data && typeof data === "object") {
                    // Only re-render if data has actually changed to save CPU/battery
                    if (!isManifestIdentical(currentManifest, data)) {
                        currentManifest = data;
                        applyManifest(data);
                    }
                }
            })
            .catch((err) => {
                console.warn("Could not fetch remote sources.json; using cached fallback:", err);
            });
    }

    /**
     * Compare manifests to avoid redundant DOM destruction and repaints
     */
    function isManifestIdentical(a, b) {
        if (!a || !b) return false;
        if (a.name !== b.name) return false;
        const appsA = a.apps || [];
        const appsB = b.apps || [];
        if (appsA.length !== appsB.length) return false;
        for (let i = 0; i < appsA.length; i++) {
            if (appsA[i].bundleIdentifier !== appsB[i].bundleIdentifier) return false;
            const verA = (appsA[i].versions && appsA[i].versions[0]) ? appsA[i].versions[0].version : appsA[i].version;
            const verB = (appsB[i].versions && appsB[i].versions[0]) ? appsB[i].versions[0].version : appsB[i].version;
            if (verA !== verB) return false;
            const urlA = (appsA[i].versions && appsA[i].versions[0]) ? appsA[i].versions[0].downloadURL : appsA[i].downloadURL;
            const urlB = (appsB[i].versions && appsB[i].versions[0]) ? appsB[i].versions[0].downloadURL : appsB[i].downloadURL;
            if (urlA !== urlB) return false;
        }
        const newsA = (a.news && a.news[0]) ? a.news[0].title : "";
        const newsB = (b.news && b.news[0]) ? b.news[0].title : "";
        if (newsA !== newsB) return false;
        return true;
    }

    /**
     * Apply manifest metadata to DOM
     */
    function applyManifest(data) {
        const titleEl = document.getElementById("sourceTitle");
        const descEl = document.getElementById("sourceDescription");
        const avatarImg = document.getElementById("heroAvatarImg");
        const appCountText = document.getElementById("appCountText");

        if (data.name && titleEl) titleEl.textContent = data.name;
        if ((data.description || data.subtitle) && descEl) {
            descEl.textContent = data.description || data.subtitle;
        }

        if (avatarImg) {
            avatarImg.src = "icons/profile.png";
            avatarImg.alt = data.name || "DexterDevKH";
            avatarImg.onerror = function () {
                this.onerror = null;
                this.src = data.iconURL || "https://github.com/DexterDevKH.png";
            };
        }

        if (Array.isArray(data.apps) && appCountText) {
            const count = data.apps.length;
            appCountText.textContent = `${count} ${count === 1 ? "App" : "Apps"} Available`;
        }

        // News banner
        const newsBanner = document.getElementById("newsBanner");
        const newsHeadline = document.getElementById("newsHeadline");
        const newsCaption = document.getElementById("newsCaption");
        const newsCloseBtn = document.getElementById("newsCloseBtn");

        if (Array.isArray(data.news) && data.news.length > 0) {
            const latestNews = data.news[0];
            if (newsHeadline) newsHeadline.textContent = latestNews.title || "Latest Update";
            if (newsCaption) newsCaption.textContent = latestNews.caption || "";
            if (latestNews.tintColor && newsBanner) {
                const hexColor = latestNews.tintColor.startsWith("#") ? latestNews.tintColor : `#${latestNews.tintColor}`;
                newsBanner.style.setProperty("--news-accent", hexColor);
            }
            if (newsBanner) newsBanner.classList.remove("hidden");
        }

        if (newsCloseBtn && newsBanner) {
            newsCloseBtn.addEventListener("click", () => {
                newsBanner.style.transition = "opacity 0.25s ease, transform 0.25s ease";
                newsBanner.style.opacity = "0";
                newsBanner.style.transform = "translateY(-6px)";
                setTimeout(() => {
                    newsBanner.classList.add("hidden");
                }, 250);
            });
        }

        renderApps();

        // Check if ?app=bundle.id is passed to auto open detail modal
        const targetAppId = urlParams.get("app");
        if (targetAppId && Array.isArray(data.apps)) {
            const match = data.apps.find(
                (a) => a.bundleIdentifier === targetAppId || a.name.toLowerCase() === targetAppId.toLowerCase()
            );
            if (match) openAppDetailsModal(match);
        }
    }

    /**
     * Render apps list matching current filter and search
     */
    function renderApps() {
        const container = document.getElementById("appsListContainer");
        if (!container) return;

        const apps = Array.isArray(currentManifest.apps) ? currentManifest.apps : [];

        const filtered = apps.filter((app) => {
            // Category filter
            if (activeFilter !== "all") {
                const appCat = getAppCategory(app).toLowerCase();
                if (activeFilter === "entertainment" && !appCat.includes("entertainment") && !appCat.includes("video")) {
                    return false;
                }
                if (activeFilter === "music" && !appCat.includes("music") && !appCat.includes("audio")) {
                    return false;
                }
            }

            // Search filter
            if (activeSearch) {
                const name = (app.name || "").toLowerCase();
                const sub = (app.subtitle || "").toLowerCase();
                const dev = (app.developerName || "").toLowerCase();
                const desc = (app.localizedDescription || "").toLowerCase();
                const bundle = (app.bundleIdentifier || "").toLowerCase();
                return name.includes(activeSearch) || sub.includes(activeSearch) || dev.includes(activeSearch) || desc.includes(activeSearch) || bundle.includes(activeSearch);
            }

            return true;
        });

        container.replaceChildren();

        if (filtered.length === 0) {
            const emptyEl = document.createElement("div");
            emptyEl.style.cssText = "text-align:center; padding: 28px 16px; color: var(--text-muted); font-size: 0.85rem;";
            emptyEl.textContent = `No applications found matching "${activeSearch}".`;
            container.appendChild(emptyEl);
            return;
        }

        filtered.forEach((app) => {
            const card = createAppCard(app);
            container.appendChild(card);
        });
    }

    /**
     * Creates an individual App Card element
     */
    function createAppCard(app) {
        const latestVer = (Array.isArray(app.versions) && app.versions[0]) ? app.versions[0] : app;
        const versionStr = latestVer.version || app.version || "Latest";
        const downloadUrl = latestVer.downloadURL || app.downloadURL || "#";
        const sizeFormatted = formatBytes(latestVer.size || app.size || 0);

        const card = document.createElement("div");
        card.className = "app-card-item";

        // Left section: Icon + info
        const left = document.createElement("div");
        left.className = "app-card-left";

        const icon = document.createElement("img");
        icon.className = "app-icon-squircle";
        icon.src = getAppIconUrl(app);
        icon.alt = app.name || "App Icon";
        icon.loading = "lazy";
        icon.onerror = function () {
            if (app.iconURL && this.src !== app.iconURL) {
                this.src = app.iconURL;
            } else if (app.bundleIdentifier === "com.google.ios.youtubemusic") {
                this.src = "icons/dtmusicultimate.png";
            } else {
                this.src = "icons/dtlite.png";
            }
        };

        const details = document.createElement("div");
        details.className = "app-card-details";

        const headerRow = document.createElement("div");
        headerRow.className = "app-card-header";

        const title = document.createElement("span");
        title.className = "app-title-text";
        title.textContent = app.name || "App";

        headerRow.appendChild(title);

        const category = getAppCategory(app);
        if (category) {
            const catBadge = document.createElement("span");
            catBadge.className = "app-category-badge";
            catBadge.textContent = category === "entertainment" ? "Video & Media" : (category === "music" ? "Music" : category);
            headerRow.appendChild(catBadge);
        }

        const subtitle = document.createElement("span");
        subtitle.className = "app-subtitle-text";
        subtitle.textContent = app.subtitle || app.developerName || "iOS Application";

        const tagsRow = document.createElement("div");
        tagsRow.className = "app-card-tags";

        const sizeTag = document.createElement("span");
        sizeTag.className = "app-tag-pill";
        sizeTag.textContent = sizeFormatted;
        tagsRow.appendChild(sizeTag);

        details.appendChild(headerRow);
        details.appendChild(subtitle);
        details.appendChild(tagsRow);

        left.appendChild(icon);
        left.appendChild(details);

        // Right section: version pill + details chevron
        const right = document.createElement("div");
        right.className = "app-card-right";

        const versionPill = document.createElement("a");
        versionPill.className = "app-version-pill";
        versionPill.textContent = `v${versionStr}`;
        if (downloadUrl && downloadUrl !== "#") {
            versionPill.href = downloadUrl;
            versionPill.target = "_blank";
            versionPill.rel = "noopener";
            versionPill.title = "Download IPA";
        }
        versionPill.addEventListener("click", (e) => e.stopPropagation());

        const detailsBtn = document.createElement("button");
        detailsBtn.className = "app-details-btn";
        detailsBtn.type = "button";
        detailsBtn.setAttribute("aria-label", "View App Details");
        detailsBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;

        right.appendChild(versionPill);
        right.appendChild(detailsBtn);

        card.appendChild(left);
        card.appendChild(right);

        // Clicking card opens details
        card.addEventListener("click", () => {
            openAppDetailsModal(app);
        });

        return card;
    }

    /**
     * App Details Bottom Sheet / Modal
     */
    function openAppDetailsModal(app) {
        const modal = document.getElementById("appDetailsModal");
        if (!modal) return;

        const latestVer = (Array.isArray(app.versions) && app.versions[0]) ? app.versions[0] : app;
        const versionStr = latestVer.version || app.version || "Latest";
        const downloadUrl = latestVer.downloadURL || app.downloadURL || "#";
        const sizeFormatted = formatBytes(latestVer.size || app.size || 0);
        const formattedDate = formatDate(latestVer.date || app.versionDate);

        // Populate elements
        const detailIcon = document.getElementById("detailAppIcon");
        if (detailIcon) {
            detailIcon.src = getAppIconUrl(app);
            detailIcon.alt = app.name || "App Icon";
            detailIcon.onerror = function () {
                if (app.iconURL && this.src !== app.iconURL) {
                    this.src = app.iconURL;
                } else if (app.bundleIdentifier === "com.google.ios.youtubemusic") {
                    this.src = "icons/dtmusicultimate.png";
                } else {
                    this.src = "icons/dtlite.png";
                }
            };
        }
        document.getElementById("detailAppTitle").textContent = app.name || "Application";
        document.getElementById("detailAppSubtitle").textContent = app.subtitle || "";
        document.getElementById("detailBundleId").textContent = app.bundleIdentifier || "";
        document.getElementById("detailVersion").textContent = `v${versionStr}`;

        const downloadBtn = document.getElementById("detailDownloadBtn");
        if (downloadBtn) {
            downloadBtn.href = downloadUrl;
        }

        const copyIpaBtn = document.getElementById("detailCopyIpaBtn");
        if (copyIpaBtn) {
            copyIpaBtn.onclick = async () => {
                await copyToClipboard(downloadUrl);
                showToast("Direct IPA Download link copied!");
            };
        }

        document.getElementById("detailDescription").textContent =
            app.localizedDescription || app.versionDescription || "No detailed description provided.";

        // Populate screenshots gallery
        const screenshotsSection = document.getElementById("detailScreenshotsSection");
        const screenshotsContainer = document.getElementById("detailScreenshotsContainer");
        if (screenshotsSection && screenshotsContainer) {
            screenshotsContainer.replaceChildren();
            const rawList = (app.screenshots && Array.isArray(app.screenshots.iphone)) ? app.screenshots.iphone : [];
            const urlList = rawList.map(s => (typeof s === "string" ? s : (s && s.imageURL ? s.imageURL : ""))).filter(Boolean);

            if (urlList.length > 0) {
                urlList.forEach((url, idx) => {
                    const img = document.createElement("img");
                    img.className = "detail-screenshot-img";
                    img.src = url;
                    img.alt = `${app.name} Screenshot ${idx + 1}`;
                    img.title = "Click to preview full screenshot";
                    img.loading = "lazy";
                    img.setAttribute("role", "button");
                    img.setAttribute("tabindex", "0");
                    img.setAttribute("aria-label", `Preview screenshot ${idx + 1} of ${urlList.length}`);
                    img.addEventListener("click", () => {
                        openScreenshotLightbox(urlList, idx, app.name);
                    });
                    img.addEventListener("keydown", (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openScreenshotLightbox(urlList, idx, app.name);
                        }
                    });
                    screenshotsContainer.appendChild(img);
                });
                screenshotsSection.classList.remove("hidden");
            } else {
                screenshotsSection.classList.add("hidden");
            }
        }

        // Populate specifications
        document.getElementById("specBundleId").textContent = app.bundleIdentifier || "-";
        document.getElementById("specDev").textContent = app.developerName || "DexterDevKH";
        document.getElementById("specSize").textContent = sizeFormatted;
        document.getElementById("specDate").textContent = formattedDate;

        // Populate changelog list
        const changelogList = document.getElementById("detailChangelogList");
        if (changelogList) {
            changelogList.replaceChildren();
            const versions = Array.isArray(app.versions) ? app.versions : [app];

            versions.forEach((ver) => {
                const item = document.createElement("div");
                item.className = "changelog-entry";

                const header = document.createElement("div");
                header.className = "changelog-header";

                const verSpan = document.createElement("span");
                verSpan.className = "changelog-version";
                verSpan.textContent = `Version ${ver.version || "Update"}`;

                const dateSpan = document.createElement("span");
                dateSpan.className = "changelog-date";
                dateSpan.textContent = formatDate(ver.date);

                header.appendChild(verSpan);
                header.appendChild(dateSpan);

                const body = document.createElement("div");
                body.className = "changelog-body";
                body.textContent = ver.localizedDescription || "Maintenance release and optimizations.";

                item.appendChild(header);
                item.appendChild(body);
                changelogList.appendChild(item);
            });
        }

        modal.classList.remove("hidden");
    }

    /**
     * Open Fullscreen Screenshot Lightbox Preview
     */
    function openScreenshotLightbox(urls, initialIndex = 0, appName = "Screenshot") {
        if (!urls || urls.length === 0) return;
        activeScreenshotsList = urls;
        currentScreenshotIndex = Math.max(0, Math.min(initialIndex, urls.length - 1));
        currentScreenshotAppName = appName || "Screenshot";

        const modal = document.getElementById("screenshotPreviewModal");
        if (!modal) return;

        updateScreenshotLightbox();
        modal.classList.remove("hidden");
    }

    /**
     * Close Screenshot Lightbox Preview
     */
    function closeScreenshotLightbox() {
        const modal = document.getElementById("screenshotPreviewModal");
        if (modal) modal.classList.add("hidden");
    }

    /**
     * Update active screenshot image and controls in lightbox
     */
    function updateScreenshotLightbox() {
        const img = document.getElementById("lightboxImage");
        const counter = document.getElementById("lightboxCounter");
        const prevBtn = document.getElementById("lightboxPrevBtn");
        const nextBtn = document.getElementById("lightboxNextBtn");

        if (!img || activeScreenshotsList.length === 0) return;

        const currentUrl = activeScreenshotsList[currentScreenshotIndex];
        img.src = currentUrl;
        img.alt = `${currentScreenshotAppName} - Screenshot ${currentScreenshotIndex + 1} of ${activeScreenshotsList.length}`;

        if (counter) {
            counter.textContent = `${currentScreenshotIndex + 1} / ${activeScreenshotsList.length}`;
            counter.style.display = activeScreenshotsList.length > 1 ? "block" : "none";
        }

        if (prevBtn) {
            prevBtn.style.display = activeScreenshotsList.length > 1 ? "flex" : "none";
        }
        if (nextBtn) {
            nextBtn.style.display = activeScreenshotsList.length > 1 ? "flex" : "none";
        }
    }

    /**
     * Navigate next/prev screenshot in lightbox
     */
    function stepScreenshotLightbox(step) {
        if (activeScreenshotsList.length <= 1) return;
        currentScreenshotIndex = (currentScreenshotIndex + step + activeScreenshotsList.length) % activeScreenshotsList.length;
        updateScreenshotLightbox();
    }

    /**
     * Dynamically load QR Engine on-demand to save mobile bandwidth & load time
     */
    function loadQrEngine() {
        return new Promise((resolve) => {
            if (typeof qrcode === "function" || window.qrcode) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "qrcode.min.js";
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.warn("Could not load qrcode.min.js");
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Modals management (QR Code, App Details, Screenshot Lightbox, Esc key listeners)
     */
    function initModals() {
        const qrLauncherBtn = document.getElementById("qrLauncherBtn");
        const qrModal = document.getElementById("qrModal");
        const qrModalCloseBtn = document.getElementById("qrModalCloseBtn");

        const appDetailsModal = document.getElementById("appDetailsModal");
        const appModalCloseBtn = document.getElementById("appModalCloseBtn");

        if (qrLauncherBtn && qrModal) {
            qrLauncherBtn.addEventListener("click", async () => {
                qrModal.classList.remove("hidden");
                await loadQrEngine();
                renderActiveQrCode();
            });
        }

        if (qrModalCloseBtn && qrModal) {
            qrModalCloseBtn.addEventListener("click", () => qrModal.classList.add("hidden"));
            qrModal.addEventListener("click", (e) => {
                if (e.target === qrModal) qrModal.classList.add("hidden");
            });
        }

        if (appModalCloseBtn && appDetailsModal) {
            appModalCloseBtn.addEventListener("click", () => appDetailsModal.classList.add("hidden"));
            appDetailsModal.addEventListener("click", (e) => {
                if (e.target === appDetailsModal) appDetailsModal.classList.add("hidden");
            });
        }

        // QR Target selector tabs
        const qrTargetTabs = document.getElementById("qrTargetTabs");
        if (qrTargetTabs) {
            qrTargetTabs.querySelectorAll(".qr-tab").forEach((tab) => {
                tab.addEventListener("click", () => {
                    qrTargetTabs.querySelectorAll(".qr-tab").forEach((t) => t.classList.remove("active"));
                    tab.classList.add("active");
                    activeQrTarget = tab.getAttribute("data-target") || "sidestore";
                    renderActiveQrCode();
                });
            });
        }

        // Screenshot Lightbox Modal
        const screenshotModal = document.getElementById("screenshotPreviewModal");
        const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
        const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
        const lightboxNextBtn = document.getElementById("lightboxNextBtn");
        const lightboxMediaWrap = document.getElementById("lightboxMediaWrap");
        const lightboxContainer = document.getElementById("lightboxContainer");

        if (lightboxCloseBtn) {
            lightboxCloseBtn.addEventListener("click", closeScreenshotLightbox);
        }

        if (lightboxPrevBtn) {
            lightboxPrevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                stepScreenshotLightbox(-1);
            });
        }

        if (lightboxNextBtn) {
            lightboxNextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                stepScreenshotLightbox(1);
            });
        }

        if (screenshotModal) {
            screenshotModal.addEventListener("click", (e) => {
                if (e.target === screenshotModal || e.target === lightboxContainer || e.target === lightboxMediaWrap) {
                    closeScreenshotLightbox();
                }
            });

            // Touch Swipe navigation on mobile devices
            let touchStartX = 0;
            let touchStartY = 0;
            screenshotModal.addEventListener("touchstart", (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            screenshotModal.addEventListener("touchend", (e) => {
                if (e.changedTouches && e.changedTouches.length === 1) {
                    const diffX = e.changedTouches[0].clientX - touchStartX;
                    const diffY = e.changedTouches[0].clientY - touchStartY;
                    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                        if (diffX < 0) {
                            stepScreenshotLightbox(1); // Swipe left -> next
                        } else {
                            stepScreenshotLightbox(-1); // Swipe right -> prev
                        }
                    }
                }
            }, { passive: true });
        }
    }

    /**
     * Render dynamic QR Code on Canvas
     */
    function renderActiveQrCode() {
        const canvas = document.getElementById("qrCanvas");
        const captionText = document.getElementById("qrCaptionText");
        if (!canvas) return;

        let targetUrl = sourceUrl;
        let caption = "SideStore Source";

        if (activeQrTarget === "sidestore") {
            targetUrl = SCHEMES.sidestore(sourceUrl);
            caption = "Direct SideStore Import Scheme";
        } else if (activeQrTarget === "altstore") {
            targetUrl = SCHEMES.altstore(sourceUrl);
            caption = "Direct AltStore Import Scheme";
        } else if (activeQrTarget === "livecontainer") {
            targetUrl = SCHEMES.livecontainer(sourceUrl);
            caption = "Direct LiveContainer Import Scheme";
        } else if (activeQrTarget === "feather") {
            targetUrl = SCHEMES.feather(sourceUrl);
            caption = "Direct Feather Import Scheme";
        } else if (activeQrTarget === "portal") {
            targetUrl = (currentManifest && currentManifest.website) || "https://dexterdevkh.github.io/dexter-sources/";
            caption = "DexterDevKH Web Portal URL";
        }

        if (captionText) {
            captionText.innerHTML = `Target: <code>${caption}</code>`;
        }

        generateQrOnCanvas(canvas, targetUrl);
    }

    /**
     * Keyboard Shortcuts
     */
    function initKeyboardShortcuts() {
        window.addEventListener("keydown", (e) => {
            const screenshotModal = document.getElementById("screenshotPreviewModal");
            const isScreenshotOpen = screenshotModal && !screenshotModal.classList.contains("hidden");

            if (e.key === "Escape") {
                if (isScreenshotOpen) {
                    closeScreenshotLightbox();
                    return;
                }
                const qrModal = document.getElementById("qrModal");
                const appModal = document.getElementById("appDetailsModal");
                if (qrModal) qrModal.classList.add("hidden");
                if (appModal) appModal.classList.add("hidden");
            } else if (isScreenshotOpen) {
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    stepScreenshotLightbox(-1);
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    stepScreenshotLightbox(1);
                }
            } else if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
                e.preventDefault();
                const searchInput = document.getElementById("appSearchInput");
                if (searchInput) searchInput.focus();
            }
        });
    }

    /**
     * Helper: Format bytes to human-readable string (MB / GB)
     */
    function formatBytes(bytes) {
        if (!bytes || bytes <= 0) return "0 MB";
        const mb = bytes / (1024 * 1024);
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(2)} GB`;
        }
        return `${mb.toFixed(1)} MB`;
    }

    /**
     * Helper: Format ISO date string
     */
    function formatDate(isoStr) {
        if (!isoStr) return "Recent";
        try {
            const date = new Date(isoStr);
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        } catch {
            return isoStr;
        }
    }

    /**
     * Helper: Toast notifications
     */
    let toastTimeout;
    function showToast(message) {
        const toast = document.getElementById("toastPill");
        const msgEl = document.getElementById("toastMessage");
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.classList.remove("hidden");

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2800);
    }

    /**
     * Helper: Copy to clipboard with fallback
     */
    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn("Clipboard API failed:", err);
            }
        }

        // Fallback for non-https or older webviews
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        let successful = false;
        try {
            successful = document.execCommand("copy");
        } catch (err) {
            console.error("execCommand fallback failed:", err);
        }
        document.body.removeChild(textarea);
        return successful;
    }

    /**
     * Standards-Compliant ISO/IEC 18004 QR Code Canvas Renderer
     * Uses self-contained Kazuhiko Arase QR engine with auto version selection,
     * Reed-Solomon error correction (Level M), and 4-module quiet zone margin.
     */
    function generateQrOnCanvas(canvas, text) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const size = canvas.width;

        // Reset canvas to pure white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        const qrLib = (typeof qrcode === "function") ? qrcode : (window.qrcode || null);
        if (typeof qrLib === "function") {
            try {
                // Type number 0 enables automatic version selection (1-40)
                // Error correction level 'M' (15%) is optimal for camera recognition
                const qr = qrLib(0, "M");
                qr.addData(text);
                qr.make();

                const moduleCount = qr.getModuleCount();
                // Standard 4-module quiet zone for robust camera detection
                const margin = 4;
                const totalModules = moduleCount + (margin * 2);
                const cellSize = size / totalModules;

                ctx.fillStyle = "#0f172a";
                for (let r = 0; r < moduleCount; r++) {
                    for (let c = 0; c < moduleCount; c++) {
                        if (qr.isDark(r, c)) {
                            const x = Math.round((c + margin) * cellSize);
                            const y = Math.round((r + margin) * cellSize);
                            const w = Math.ceil(cellSize);
                            const h = Math.ceil(cellSize);
                            ctx.fillRect(x, y, w, h);
                        }
                    }
                }
                return;
            } catch (err) {
                console.error("QR generation error:", err);
            }
        }

        // Visual fallback
        ctx.fillStyle = "#64748b";
        ctx.font = "14px Inter, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Could not load QR engine", size / 2, size / 2);
    }

})();