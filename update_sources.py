#!/usr/bin/env python3
"""
DexterDevKH Source Updater
==========================
Synchronizes GitHub Releases with SideStore & AltStore sources.json manifest.
Supports multiple apps, version sanitization, release body parsing, news item
generation, and safe atomic writing.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import sys
import tempfile
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("source_updater")

GITHUB_OWNER = os.environ.get("GITHUB_OWNER", "DexterDevKH")
DEFAULT_TOKEN = os.environ.get("TOKEN") or os.environ.get("GITHUB_TOKEN") or ""


@dataclass
class AppConfig:
    bundle_id: str
    repo: str
    name: str
    subtitle: str
    category: str
    tint_color: str
    icon_url: str
    ipa_keyword: str = ".ipa"
    fallback_description: str = ""
    min_os_version: str = "14.0"
    screenshots: Dict[str, List[Dict[str, Any]]] = field(default_factory=lambda: {"iphone": []})
    app_permissions: Dict[str, Any] = field(default_factory=lambda: {"entitlements": [], "privacy": {}})


# Configured applications in DexterDevKH source
APP_CONFIGS: List[AppConfig] = [
    AppConfig(
        bundle_id="com.google.ios.youtube",
        repo=f"{GITHUB_OWNER}/DTLite",
        name="DexTube",
        subtitle="Enhanced YouTube client with ad-blocking & background play",
        category="entertainment",
        tint_color="#007AFF",
        icon_url=f"https://raw.githubusercontent.com/{GITHUB_OWNER}/dexter-sources/main/icons/dtlite.png",
        fallback_description="Official iOS release of DTLite (DexTube) featuring ad-blocking, background playback, and SponsorBlock.",
        min_os_version="14.0",
        screenshots={
            "iphone": [
                {
                    "width": 1242,
                    "height": 2556,
                    "imageURL": f"https://raw.githubusercontent.com/{GITHUB_OWNER}/DTLite/main/Resources/scr{i}.jpg",
                }
                for i in range(1, 10)
            ]
        },
        app_permissions={
            "entitlements": [],
            "privacy": {
                "NSBackgroundAudioUsageDescription": "Allows audio and video playback in background and Picture-in-Picture.",
                "NSBackgroundFetchUsageDescription": "Allows background updates and download synchronization.",
            },
        },
    ),
    AppConfig(
        bundle_id="com.google.ios.youtubemusic",
        repo=f"{GITHUB_OWNER}/DTMusicUltimate",
        name="DexTube Music",
        subtitle="High-fidelity music streaming, background audio & lyrics",
        category="music",
        tint_color="#FF2D55",
        icon_url=f"https://raw.githubusercontent.com/{GITHUB_OWNER}/dexter-sources/main/icons/dtmusicultimate.png",
        fallback_description="Official iOS release of DTMusicUltimate (DexTube Music) featuring background audio, ad-free listening, and lossless presets.",
        min_os_version="14.0",
        screenshots={
            "iphone": [
                {
                    "width": 1000,
                    "height": 2060,
                    "imageURL": f"https://raw.githubusercontent.com/{GITHUB_OWNER}/DTMusicUltimate/main/Resources/scrn{i}.png",
                }
                for i in range(1, 6)
            ]
        },
        app_permissions={
            "entitlements": [],
            "privacy": {
                "NSBackgroundAudioUsageDescription": "Enables uninterrupted high-fidelity background music and lock screen playback controls.",
                "NSBackgroundFetchUsageDescription": "Enables background sync and offline cache verification.",
            },
        },
    ),
]


def make_request(url: str, token: str = "") -> urllib.request.Request:
    """Creates an authenticated or anonymous request for GitHub REST API."""
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "DexterDevKH-Source-Updater/2.0")
    req.add_header("Accept", "application/vnd.github.v3+json")
    auth_token = token or DEFAULT_TOKEN
    if auth_token:
        req.add_header("Authorization", f"Bearer {auth_token}")
    return req


def fetch_json(url: str, token: str = "") -> Optional[Any]:
    """Fetches JSON from URL with proper error handling."""
    req = make_request(url, token)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content)
    except urllib.error.HTTPError as e:
        logger.warning("HTTP Error %s fetching %s: %s", e.code, url, e.reason)
        if e.code == 403:
            logger.warning("GitHub API rate limit may be exceeded. Provide GITHUB_TOKEN to increase limit.")
    except Exception as e:
        logger.error("Network error fetching %s: %s", url, e)
    return None


def get_profile_avatar(owner: str, token: str = "") -> str:
    """Retrieves user avatar from GitHub API or falls back to public avatar URL."""
    url = f"https://api.github.com/users/{owner}"
    data = fetch_json(url, token)
    if isinstance(data, dict) and "avatar_url" in data:
        return data["avatar_url"]
    return f"https://github.com/{owner}.png"


def sanitize_version(tag_name: str) -> str:
    """
    Cleans release tag names into semantic/standard iOS version strings.
    Examples:
      'ytp-v6.0.b2-21.41.5' -> '21.41.5'
      'dtm-9.41.2'          -> '9.41.2'
      'v1.2.3'              -> '1.2.3'
    """
    tag = tag_name.strip()
    if "-" in tag:
        last_part = tag.split("-")[-1].lstrip("vV").strip()
        if last_part and last_part[0].isdigit():
            return last_part

    for prefix in ["ytp-v", "ytp-", "dtm-v", "dtm-", "v", "V"]:
        if tag.startswith(prefix):
            return tag[len(prefix):].strip()

    # Extract first digit sequence resembling a version
    match = re.search(r"\d+(\.\d+)+", tag)
    if match:
        return match.group(0)

    return tag


def extract_release_tag_url(repo: str, download_url: str, version: str) -> str:
    """Extracts GitHub release tag web page URL from release assets or download URL."""
    if download_url and "/releases/download/" in download_url:
        try:
            tag = download_url.split("/releases/download/")[1].split("/")[0]
            return f"https://github.com/{repo}/releases/tag/{tag}"
        except Exception:
            pass
    return f"https://github.com/{repo}/releases/tag/v{version}"


def clean_release_body(body: Optional[str], default_text: str) -> str:
    """Formats markdown release body into readable, clean release description."""
    if not body or not body.strip():
        return default_text

    text = body.strip()
    # Normalize bullet points and line endings
    text = re.sub(r"\r\n", "\n", text)
    # Remove markdown image tags or badge links
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    # Remove excessive empty lines
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    # Limit length if gigantic
    if len(text) > 800:
        text = text[:797] + "..."
    return text if text else default_text


def load_source_manifest(path: str) -> Dict[str, Any]:
    """Loads and validates the source JSON manifest."""
    if not os.path.exists(path):
        logger.info("Manifest '%s' not found. Creating standard initial manifest.", path)
        return {
            "name": f"{GITHUB_OWNER} Apps",
            "identifier": f"com.{GITHUB_OWNER.lower()}.source",
            "website": f"https://{GITHUB_OWNER.lower()}.github.io/dexter-sources/",
            "subtitle": "Official SideStore, Feather, and AltStore Source.",
            "description": "High-performance curated iOS apps including DexTube and DexTube Music.",
            "tintColor": "#007AFF",
            "iconURL": f"https://github.com/{GITHUB_OWNER}.png",
            "headerURL": f"https://github.com/{GITHUB_OWNER}.png",
            "apps": [],
            "news": [],
        }

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        if not isinstance(data, dict):
            raise ValueError(f"Invalid format in {path}: root must be a JSON object.")
        return data


def save_source_manifest_atomic(path: str, data: Dict[str, Any]) -> None:
    """Writes the manifest safely to a temp file first, then atomically replaces target."""
    dir_name = os.path.dirname(os.path.abspath(path))
    with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tf:
        temp_name = tf.name
        json.dump(data, tf, indent=2, ensure_ascii=False)
        tf.write("\n")

    os.replace(temp_name, path)
    logger.info("Successfully saved updated manifest to '%s'", path)


def generate_news_item(
    app_name: str,
    version: str,
    date_str: str,
    icon_url: str,
    bundle_id: str,
    tint_color: str = "#007AFF",
    url: str = "",
) -> Dict[str, Any]:
    """Creates a news announcement entry for new releases matching SideStore specification."""
    if date_str and "T" in date_str:
        formatted_date = date_str.split("T")[0]
    elif date_str:
        formatted_date = date_str[:10]
    else:
        formatted_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    color = tint_color if tint_color.startswith("#") else f"#{tint_color}"
    news_url = url or f"https://dexterdevkh.github.io/dexter-sources/?app={bundle_id}"
    return {
        "title": f"{app_name} v{version} Released",
        "identifier": f"release-{bundle_id.replace('.', '-')}-{version.replace('.', '-')}",
        "caption": f"Version {version} is now available with the latest features, enhancements, and iOS 18 fixes.",
        "tintColor": color,
        "imageURL": icon_url,
        "url": news_url,
        "date": formatted_date,
        "notify": True,
    }


def update_manifest(
    source_path: str = "sources.json",
    max_versions: int = 3,
    max_news: int = 2,
    token: str = "",
    dry_run: bool = False,
    update_news: bool = True,
) -> int:
    """
    Main reconciliation loop that fetches GitHub releases and syncs with sources.json.
    Returns the number of updated apps.
    """
    manifest = load_source_manifest(source_path)

    # Refresh owner metadata
    avatar_url = get_profile_avatar(GITHUB_OWNER, token)
    manifest["iconURL"] = avatar_url or manifest.get("iconURL", "https://avatars.githubusercontent.com/u/274127037?v=4")
    manifest["headerURL"] = avatar_url or manifest.get("headerURL", manifest["iconURL"])
    manifest.setdefault("news", [])

    existing_apps_by_id: Dict[str, Dict[str, Any]] = {
        app.get("bundleIdentifier"): app for app in manifest.get("apps", []) if isinstance(app, dict)
    }

    updated_count = 0
    new_announcements: List[Dict[str, Any]] = []

    for conf in APP_CONFIGS:
        logger.info("Checking repository %s (%s)...", conf.repo, conf.name)
        releases_url = f"https://api.github.com/repos/{conf.repo}/releases?per_page=15"
        releases = fetch_json(releases_url, token)

        if not isinstance(releases, list):
            logger.warning("Could not fetch releases for %s. Keeping existing metadata.", conf.repo)
            continue

        valid_versions: List[Dict[str, Any]] = []

        for rel in releases:
            if not isinstance(rel, dict) or rel.get("draft", False):
                continue

            assets = rel.get("assets", [])
            ipa_asset = None
            for asset in assets:
                asset_name = (asset.get("name") or "").lower()
                if asset_name.endswith(conf.ipa_keyword.lower()):
                    ipa_asset = asset
                    break

            if not ipa_asset:
                continue

            tag_name = rel.get("tag_name") or ""
            clean_ver = sanitize_version(tag_name)
            pub_date = rel.get("published_at")
            if pub_date and "T" in pub_date:
                clean_date = pub_date.split("T")[0]
            elif pub_date:
                clean_date = pub_date[:10]
            else:
                clean_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

            changelog = clean_release_body(rel.get("body"), f"Version {clean_ver} release.")

            ver_dict: Dict[str, Any] = {
                "version": clean_ver,
                "date": clean_date,
                "localizedDescription": changelog,
                "downloadURL": ipa_asset.get("browser_download_url"),
                "size": ipa_asset.get("size", 0),
            }
            if conf.min_os_version:
                ver_dict["minOSVersion"] = conf.min_os_version

            valid_versions.append(ver_dict)

            if len(valid_versions) >= max_versions:
                break

        if not valid_versions:
            logger.warning("No IPA asset releases found for %s", conf.repo)
            continue

        latest_version = valid_versions[0]
        app_entry = existing_apps_by_id.get(conf.bundle_id)
        is_new_app = app_entry is None

        tint_color = conf.tint_color if conf.tint_color.startswith("#") else f"#{conf.tint_color}"
        rel_url = extract_release_tag_url(conf.repo, latest_version.get("downloadURL", ""), latest_version["version"])

        existing_screenshots = {}
        if isinstance(app_entry, dict):
            existing_screenshots = app_entry.get("screenshots") or {}
        if not isinstance(existing_screenshots, dict) or not existing_screenshots.get("iphone"):
            existing_screenshots = conf.screenshots or {"iphone": []}

        app_payload = {
            "name": conf.name,
            "bundleIdentifier": conf.bundle_id,
            "developerName": GITHUB_OWNER,
            "subtitle": conf.subtitle,
            "localizedDescription": conf.fallback_description,
            "iconURL": conf.icon_url,
            "tintColor": tint_color,
            "size": latest_version["size"],
            "screenshots": existing_screenshots,
            "appPermissions": conf.app_permissions,
            "versions": valid_versions,
        }

        if is_new_app:
            manifest.setdefault("apps", []).append(app_payload)
            existing_apps_by_id[conf.bundle_id] = app_payload
            updated_count += 1
            logger.info("Added new app '%s' [%s] version %s", conf.name, conf.bundle_id, latest_version["version"])
            if update_news and max_news > 0:
                new_announcements.append(generate_news_item(
                    conf.name, latest_version["version"], latest_version["date"], conf.icon_url, conf.bundle_id, tint_color, rel_url
                ))
        else:
            old_versions = app_entry.get("versions", []) if isinstance(app_entry, dict) else []
            old_ver = old_versions[0].get("version") if old_versions else app_entry.get("version")
            old_url = old_versions[0].get("downloadURL") if old_versions else app_entry.get("downloadURL")

            changed = (old_ver != latest_version["version"]) or (old_url != latest_version["downloadURL"])

            app_entry.clear()
            app_entry.update(app_payload)

            if changed:
                updated_count += 1
                logger.info("Updated '%s' from %s to %s", conf.name, old_ver, latest_version["version"])
                if update_news and max_news > 0:
                    new_announcements.append(generate_news_item(
                        conf.name, latest_version["version"], latest_version["date"], conf.icon_url, conf.bundle_id, tint_color, rel_url
                    ))
            else:
                logger.info("'%s' is already up to date (v%s)", conf.name, old_ver)

    existing_news = manifest.get("news", [])
    if not isinstance(existing_news, list):
        existing_news = []

    if update_news and max_news > 0:
        existing_ids = {n.get("identifier") for n in existing_news if isinstance(n, dict)}
        for ann in new_announcements:
            if ann["identifier"] not in existing_ids:
                existing_news.insert(0, ann)
                existing_ids.add(ann["identifier"])

        # If existing_news is empty, generate news items for the latest release of each app
        if not existing_news:
            for conf in APP_CONFIGS:
                app_entry = existing_apps_by_id.get(conf.bundle_id)
                if not app_entry:
                    continue
                versions = app_entry.get("versions", [])
                if versions:
                    latest_v = versions[0]
                    tint_color = conf.tint_color if conf.tint_color.startswith("#") else f"#{conf.tint_color}"
                    rel_url = extract_release_tag_url(conf.repo, latest_v.get("downloadURL", ""), latest_v.get("version", ""))
                    item = generate_news_item(
                        app_name=conf.name,
                        version=latest_v.get("version", "1.0"),
                        date_str=latest_v.get("date", ""),
                        icon_url=conf.icon_url,
                        bundle_id=conf.bundle_id,
                        tint_color=tint_color,
                        url=rel_url,
                    )
                    existing_news.append(item)
                    if len(existing_news) >= max_news:
                        break

    # Rebuild canonical manifest in StikDebug format
    canonical_manifest = {
        "name": manifest.get("name", f"{GITHUB_OWNER} Apps"),
        "identifier": manifest.get("identifier", f"com.{GITHUB_OWNER.lower()}.source"),
        "website": manifest.get("website", f"https://{GITHUB_OWNER.lower()}.github.io/dexter-sources/"),
        "subtitle": manifest.get("subtitle", "Official SideStore, Feather, and AltStore Source."),
        "description": manifest.get("description", "High-performance curated iOS apps including DexTube and DexTube Music."),
        "tintColor": manifest.get("tintColor", "#007AFF"),
        "iconURL": avatar_url or manifest.get("iconURL", f"https://github.com/{GITHUB_OWNER}.png"),
        "headerURL": manifest.get("headerURL", avatar_url or f"https://github.com/{GITHUB_OWNER}.png"),
        "apps": manifest.get("apps", []),
        "news": existing_news[:max_news],
    }

    if dry_run:
        logger.info("[DRY RUN] Would write updated manifest. Total modified: %d", updated_count)
        print(json.dumps(canonical_manifest, indent=2))
        return updated_count

    save_source_manifest_atomic(source_path, canonical_manifest)
    update_readme_table("README.md", canonical_manifest)
    logger.info("Manifest sync complete. Total apps updated: %d", updated_count)
    return updated_count


def update_readme_table(readme_path: str = "README.md", manifest: Optional[Dict[str, Any]] = None) -> bool:
    """Updates the featured applications table in README.md with the latest app versions."""
    if not os.path.exists(readme_path) or not manifest:
        return False

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    modified = False
    for app in manifest.get("apps", []):
        name = app.get("name")
        versions = app.get("versions", [])
        version = app.get("version") or (versions[0].get("version") if versions else None)
        if not name or not version:
            continue

        # Match table row for this app and update the `v...` version tag
        pattern_ver = re.compile(
            rf"(\|\s*<img[^\n]*\*\*{re.escape(name)}\*\*\s*\|\s*[^|]+\|\s*)`v[^`]+`"
        )
        if pattern_ver.search(content):
            new_content = pattern_ver.sub(rf"\g<1>`v{version}`", content)
            if new_content != content:
                content = new_content
                modified = True

    if modified:
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(content)
        logger.info("Synchronized application versions in %s", readme_path)
    return modified


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Synchronize GitHub releases into SideStore/AltStore sources.json manifest."
    )
    parser.add_argument(
        "-s", "--source", default="sources.json", help="Path to source manifest JSON file (default: sources.json)"
    )
    parser.add_argument(
        "-m", "--max-versions", type=int, default=3, help="Maximum number of historical versions to keep (default: 3)"
    )
    parser.add_argument(
        "-n", "--max-news", type=int, default=2, help="Maximum number of news announcements to keep (default: 2)"
    )
    parser.add_argument(
        "-t", "--token", default="", help="GitHub Personal Access Token for higher API rate limits"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Print modified manifest without writing to disk"
    )
    parser.add_argument(
        "--no-news", action="store_true", help="Disable automatic news announcement generation"
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    try:
        updated = update_manifest(
            source_path=args.source,
            max_versions=args.max_versions,
            max_news=args.max_news,
            token=args.token,
            dry_run=args.dry_run,
            update_news=not args.no_news,
        )
        sys.exit(0)
    except Exception as exc:
        logger.exception("Fatal error during manifest update: %s", exc)
        sys.exit(1)
