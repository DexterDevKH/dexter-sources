<div align="center">

# ⚡ DexterDevKH Sources

**Official SideStore, Feather, AltStore, LiveContainer & TrollStore Repositories**

A high-performance, curated repository distributing optimized, feature-packed iOS applications with automated release synchronization.

<br>

[![Web Portal](https://img.shields.io/badge/🌐_Interactive_Web_Portal-0f172a?style=for-the-badge&logo=safari&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/)
[![Sync Status](https://img.shields.io/github/actions/workflow/status/DexterDevKH/dexter-sources/update-sources.yml?branch=main&style=for-the-badge&label=Sync%20Status)](https://github.com/DexterDevKH/dexter-sources/actions)

</div>

---

## 📱 Featured Applications

| App | Category | Latest Version | Features | Direct Download |
| :--- | :--- | :--- | :--- | :--- |
| <img src="icons/dtlite.png" width="40" height="40" style="border-radius:10px" alt="DTLite Plus" /><br>**DTLite Plus** | Video & Media | `v21.44.4` | Ad-blocking, SponsorBlock, Background Playback, PiP, OLED Pure Dark Mode | [Download IPA](https://github.com/DexterDevKH/DTLite/releases/latest) |
| <img src="icons/dtmusicultimate.png" width="40" height="40" style="border-radius:10px" alt="DexTube Music" /><br>**DexTube Music** | Music & Audio | `v9.43.2` | Lossless EQ, Ad-Free Streaming, Real-time Lyrics, Offline Playback | [Download IPA](https://github.com/DexterDevKH/DTMusicUltimate/releases/latest) |
| <img src="icons/dtkace.png" width="40" height="40" style="border-radius:10px" alt="DTKACE Plus" /><br>**DTKACE Plus** | Video & Media | `v21.44.4` | YTKACE Engine, 4K Downloader, SponsorBlock, PiP, Dislike Counter, Volume Boost | [Download IPA](https://github.com/DexterDevKH/DTKACE/releases/latest) |

---

## 🚀 One-Tap Installation

Choose the source manifest corresponding to the apps you want to install.

> [!NOTE]
> **Why are there two separate sources?**
> Both **DTLite Plus** and **DTKACE Plus** are enhanced modifications of the official YouTube iOS client sharing the bundle identifier `com.google.ios.youtube`. AltStore and SideStore require unique bundle IDs per source manifest. DTKACE Plus is hosted on its own dedicated source so you can choose whichever modification you prefer without repository conflicts.

<br>

### 1️⃣ Primary Source — DTLite Plus & DexTube Music

Includes **DTLite Plus** (ad-free YouTube with PiP & SponsorBlock) and **DexTube Music** (ad-free YouTube Music with offline audio & lossless EQ).

#### One-Tap Add Buttons
[![Add to SideStore](https://img.shields.io/badge/SideStore-6366f1?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?r=sidestore)
[![Add to Feather](https://img.shields.io/badge/Feather-ec4899?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?r=feather)
[![Add to AltStore](https://img.shields.io/badge/AltStore-10b981?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?r=altstore)
[![Add to LiveContainer](https://img.shields.io/badge/LiveContainer-3b82f6?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?r=livecontainer)
[![Add to TrollApps](https://img.shields.io/badge/TrollApps-f59e0b?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?r=trollapps)

#### Manifest URL
```text
https://dexterdevkh.github.io/dexter-sources/sources.json
```

---

### 2️⃣ DTKACE Plus Source — DTKACE Plus (YouTube Mod)

Dedicated source for **DTKACE Plus** (featuring the YTKACE tweak engine, up to 4K media downloads, PiP, SponsorBlock, dislike restoration, and 12 modular tweaks).

#### One-Tap Add Buttons
[![Add to SideStore](https://img.shields.io/badge/SideStore-6366f1?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?source=dtkace&r=sidestore)
[![Add to Feather](https://img.shields.io/badge/Feather-ec4899?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?source=dtkace&r=feather)
[![Add to AltStore](https://img.shields.io/badge/AltStore-10b981?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?source=dtkace&r=altstore)
[![Add to LiveContainer](https://img.shields.io/badge/LiveContainer-3b82f6?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?source=dtkace&r=livecontainer)
[![Add to TrollApps](https://img.shields.io/badge/TrollApps-f59e0b?style=for-the-badge&logo=apple&logoColor=white)](https://dexterdevkh.github.io/dexter-sources/?source=dtkace&r=trollapps)

#### Manifest URL
```text
https://dexterdevkh.github.io/dexter-sources/dtkace.json
```

---

## 📲 Manual Source Addition

If you prefer to add sources manually in your sideloading manager:

1. **SideStore / AltStore**:
   - Open **SideStore** or **AltStore**.
   - Tap the **Sources** tab.
   - Tap the **+** button in the top right corner.
   - Paste the chosen source URL from above and tap **Add**.
2. **Feather**:
   - Open **Feather**, go to **Sources** > **Add Source**.
   - Paste the source URL and confirm.
3. **LiveContainer**:
   - Open **LiveContainer**, tap **Sources**, and add the manifest URL.
4. **QR Code Scanning**:
   - Open the [Interactive Web Portal](https://dexterdevkh.github.io/dexter-sources/) on your PC, iPad, or Mac.
   - Toggle between **DTLite Plus & Music** and **DTKACE Plus**.
   - Scan the on-screen QR code with your iPhone camera to trigger one-tap import into SideStore or AltStore instantly.

---

## ⚙️ Automated Synchronization

This repository uses automated GitHub Actions workflows:
- Upstream releases from `DexterDevKH/DTLite`, `DexterDevKH/DTMusicUltimate`, and `DexterDevKH/DTKACE` are checked automatically every 6 hours and on dispatch.
- Downloads IPA sizes, hashes, release notes, and tags.
- Keeps version numbers in `sources.json`, `dtkace.json`, and `README.md` continuously synchronized.

---

## 🛠️ Credits & Attribution

- Built & Maintained by **[DexterDevKH](https://github.com/DexterDevKH)**
- **[DTLite](https://github.com/DexterDevKH/DTLite)** — Enhanced YouTube client with ad-blocking & background play
- **[DTMusicUltimate](https://github.com/DexterDevKH/DTMusicUltimate)** — High-fidelity music streaming client
- **[DTKACE](https://github.com/DexterDevKH/DTKACE)** — Enhanced YouTube with YTKACE tweak engine & 12 extensions
- Powered by [SideStore](https://sidestore.io/) & [AltStore](https://altstore.io/)
