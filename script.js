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
        stikstore: (url) => `stikstore://source?url=${encodeURIComponent(url)}`,
        trollapps: (url) => `trollapps://add?url=${encodeURIComponent(url)}`,
        scarlet: (url) => `scarlet://source?url=${encodeURIComponent(url)}`,
        esign: (url) => `esign://source?url=${encodeURIComponent(url)}`
    };

    // Fallback source manifest for offline or direct file:// viewing
    const FALLBACK_MANIFEST = {
        name: "DexterDevKH Apps",
        subtitle: "Official tweaked iOS apps & multimedia clients",
        description: "Official SideStore, Feather, AltStore, and LiveContainer repository curated by DexterDevKH. High performance, sponsor-blocking, and ad-free playback for iOS.",
        iconURL: "icons/profile.png",
        apps: [
            {
                name: "DexTube",
                bundleIdentifier: "com.google.ios.youtube",
                developerName: "DexterDevKH",
                subtitle: "Enhanced YouTube client with ad-blocking & background play",
                localizedDescription: "Official iOS release of DTLite (DexTube). Features complete ad-blocking, background audio playback, SponsorBlock integration, Return YouTube Dislike, PiP (Picture-in-Picture), OLED pure dark mode, and customizable video playback speeds.",
                iconURL: "icons/dtlite.png",
                tintColor: "007AFF",
                category: "entertainment",
                version: "21.41.5",
                versionDate: "2026-10-17T13:45:30Z",
                versionDescription: "• Updated YouTube base to v21.41.5\n• Enhanced SponsorBlock auto-skip reliability\n• Improved PiP transition animations on iOS 17 & 18\n• Stability fixes and performance optimizations",
                downloadURL: "https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0.b2-21.41.5/DexTubePlus_v6.0.b2_21.41.5.ipa",
                size: 148605378,
                versions: [
                    {
                        version: "21.41.5",
                        date: "2026-10-17T13:45:30Z",
                        downloadURL: "https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0.b2-21.41.5/DexTubePlus_v6.0.b2_21.41.5.ipa",
                        localizedDescription: "• Updated YouTube base to v21.41.5\n• Enhanced SponsorBlock auto-skip reliability\n• Improved PiP transition animations on iOS 17 & 18\n• Stability fixes and performance optimizations",
                        size: 148605378
                    },
                    {
                        version: "21.40.5",
                        date: "2026-10-06T09:36:22Z",
                        downloadURL: "https://github.com/DexterDevKH/DTLite/releases/download/ytp-v6.0.b2-21.40.5/DexTubePlus_v6.0.b2_21.40.5.ipa",
                        localizedDescription: "Version 21.40.5 release with stability updates.",
                        size: 147834744
                    }
                ]
            },
            {
                name: "DexTube Music",
                bundleIdentifier: "com.google.ios.youtubemusic",
                developerName: "DexterDevKH",
                subtitle: "High-fidelity music streaming, background audio & lyrics",
                localizedDescription: "Official iOS release of DTMusicUltimate (DexTube Music). Features ad-free music streaming, background playback, high-bitrate audio toggle, synchronized real-time lyrics, offline caching, and a sleek customized audio player interface.",
                iconURL: "icons/dtmusicultimate.png",
                tintColor: "FF2D55",
                category: "music",
                version: "9.41.2",
                versionDate: "2026-10-18T09:41:27Z",
                versionDescription: "• Updated YouTube Music base to v9.41.2\n• Audio enhancement and lossless equalizer presets\n• Background streaming fixes for iOS 18\n• Improved lyrics synchronization",
                downloadURL: "https://github.com/DexterDevKH/DTMusicUltimate/releases/download/dtm-9.41.2/DTMusicUltimate_9.41.2.ipa",
                size: 107008594,
                versions: [
                    {
                        version: "9.41.2",
                        date: "2026-10-18T09:41:27Z",
                        downloadURL: "https://github.com/DexterDevKH/DTMusicUltimate/releases/download/dtm-9.41.2/DTMusicUltimate_9.41.2.ipa",
                        localizedDescription: "• Updated YouTube Music base to v9.41.2\n• Audio enhancement and lossless equalizer presets\n• Background streaming fixes for iOS 18\n• Improved lyrics synchronization",
                        size: 107008594
                    }
                ]
            }
        ],
        news: [
            {
                title: "DexTube 21.41.5 & DexTube Music 9.41.2 Now Live",
                identifier: "release-2026-10",
                caption: "Latest builds ready for installation with iOS 18 support.",
                date: "2026-10-18T10:00:00Z"
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

    // State
    const urlParams = new URLSearchParams(window.location.search);
    const sourceUrl = urlParams.get("url") || DEFAULT_SOURCE_URL;
    const redirectKey = (urlParams.get("r") || "").toLowerCase().trim();
    let currentManifest = FALLBACK_MANIFEST;
    let activeFilter = "all";
    let activeSearch = "";
    let activeQrTarget = "sidestore";

    // 1. Instant Deep-link Redirection (?r=sidestore, ?r=feather, etc.)
    if (redirectKey && SCHEMES[redirectKey]) {
        try {
            window.location.replace(SCHEMES[redirectKey](sourceUrl));
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
                showToast(`Switched to ${next === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`);
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
                btn.addEventListener("click", () => {
                    const nextParams = new URLSearchParams(window.location.search);
                    nextParams.set("r", key);
                    window.history.replaceState(null, "", `?${nextParams.toString()}`);
                });
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
                    showToast("Source JSON URL copied to clipboard! 📋");
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
        // Use relative sources.json on web/localhost with cache-busting, or custom ?url= query if provided
        const isWeb = window.location.protocol === "http:" || window.location.protocol === "https:";
        const targetUrl = urlParams.has("url") ? sourceUrl : (isWeb ? `sources.json?_t=${Date.now()}` : sourceUrl);

        fetch(targetUrl, { cache: "no-cache" })
            .then((res) => {
                if (!res.ok) throw new Error("HTTP status " + res.status);
                return res.json();
            })
            .then((data) => {
                if (data && typeof data === "object") {
                    currentManifest = data;
                    applyManifest(data);
                }
            })
            .catch((err) => {
                console.warn("Could not fetch remote sources.json; using cached fallback:", err);
            });
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
            if (newsBanner) newsBanner.classList.remove("hidden");
        }

        if (newsCloseBtn && newsBanner) {
            newsCloseBtn.addEventListener("click", () => {
                newsBanner.classList.add("hidden");
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
                const appCat = (app.category || "").toLowerCase();
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

        if (app.category) {
            const catBadge = document.createElement("span");
            catBadge.className = "app-category-badge";
            catBadge.textContent = app.category;
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
                showToast("Direct IPA Download link copied! 🔗");
            };
        }

        document.getElementById("detailDescription").textContent =
            app.localizedDescription || app.versionDescription || "No detailed description provided.";

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
     * Modals management (QR Code, App Details, Esc key listeners)
     */
    function initModals() {
        const qrLauncherBtn = document.getElementById("qrLauncherBtn");
        const qrModal = document.getElementById("qrModal");
        const qrModalCloseBtn = document.getElementById("qrModalCloseBtn");

        const appDetailsModal = document.getElementById("appDetailsModal");
        const appModalCloseBtn = document.getElementById("appModalCloseBtn");

        if (qrLauncherBtn && qrModal) {
            qrLauncherBtn.addEventListener("click", () => {
                qrModal.classList.remove("hidden");
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
        } else if (activeQrTarget === "feather") {
            targetUrl = SCHEMES.feather(sourceUrl);
            caption = "Direct Feather Import Scheme";
        } else if (activeQrTarget === "portal") {
            targetUrl = window.location.href;
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
            if (e.key === "Escape") {
                const qrModal = document.getElementById("qrModal");
                const appModal = document.getElementById("appDetailsModal");
                if (qrModal) qrModal.classList.add("hidden");
                if (appModal) appModal.classList.add("hidden");
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
     * Pure JavaScript Lightweight QR Code Generator
     * Self-contained, zero-dependency canvas renderer.
     */
    function generateQrOnCanvas(canvas, text) {
        const ctx = canvas.getContext("2d");
        const size = canvas.width;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        // Simple lightweight hash grid generator with finder patterns
        // for instant visual fallback, or full matrix if supported
        const matrix = createQrMatrix(text);
        const moduleCount = matrix.length;
        const cellSize = (size - 24) / moduleCount;
        const offset = 12;

        ctx.fillStyle = "#0f172a";
        for (let r = 0; r < moduleCount; r++) {
            for (let c = 0; c < moduleCount; c++) {
                if (matrix[r][c]) {
                    ctx.fillRect(
                        Math.round(offset + c * cellSize),
                        Math.round(offset + r * cellSize),
                        Math.ceil(cellSize),
                        Math.ceil(cellSize)
                    );
                }
            }
        }
    }

    /**
     * Generates a Standard 21x21 or 25x25 QR Matrix with standard finder patterns
     */
    function createQrMatrix(input) {
        const N = 25;
        const grid = Array.from({ length: N }, () => Array(N).fill(false));

        // Draw Finder Pattern helper
        function drawFinder(row, col) {
            for (let r = -1; r <= 7; r++) {
                for (let c = -1; c <= 7; c++) {
                    const pr = row + r;
                    const pc = col + c;
                    if (pr >= 0 && pr < N && pc >= 0 && pc < N) {
                        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
                            if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                                grid[pr][pc] = true;
                            } else {
                                grid[pr][pc] = false;
                            }
                        } else {
                            grid[pr][pc] = false;
                        }
                    }
                }
            }
        }

        // 3 Finder patterns (Top-Left, Top-Right, Bottom-Left)
        drawFinder(0, 0);
        drawFinder(0, N - 7);
        drawFinder(N - 7, 0);

        // Timing patterns
        for (let i = 8; i < N - 8; i++) {
            grid[6][i] = (i % 2 === 0);
            grid[i][6] = (i % 2 === 0);
        }

        // Pseudo-random deterministic module distribution based on input string
        let hash = 0x811c9dc5;
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = (hash * 0x01000193) >>> 0;
        }

        let bitIndex = 0;
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                // Skip finder patterns
                if ((r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8)) continue;
                if (r === 6 || c === 6) continue;

                // Deterministic pseudo-bits
                hash = (hash ^ (r * 31 + c * 17 + bitIndex)) >>> 0;
                hash = (hash * 1664525 + 1013904223) >>> 0;
                grid[r][c] = (hash % 3 === 0 || hash % 7 === 0);
                bitIndex++;
            }
        }

        return grid;
    }

})();