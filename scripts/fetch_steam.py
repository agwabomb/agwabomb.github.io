#!/usr/bin/env python3
"""Fetch owned Steam games and write steam-games.json.

Reads STEAM_API_KEY and STEAM_ID from the environment, calls
IPlayerService/GetOwnedGames/v0001, keeps titles with 60+ minutes of
playtime, and writes a sorted JSON array to the repository root.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
BANNER_URL = (
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appid}/header.jpg"
)
MIN_PLAYTIME_MINUTES = 60
ROOT_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT_DIR / "steam-games.json"


def require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing required environment variable: {name}")
    return value


def fetch_owned_games(api_key: str, steam_id: str) -> list[dict]:
    query = urllib.parse.urlencode(
        {
            "key": api_key,
            "steamid": steam_id,
            "include_appinfo": 1,
            "format": "json",
        }
    )
    request = urllib.request.Request(
        f"{API_URL}?{query}",
        headers={"User-Agent": "agwabomb-portfolio-steam-sync/1.0"},
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise SystemExit(f"Steam Web API HTTP {exc.code}: {exc.reason}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Steam Web API request failed: {exc.reason}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Steam Web API returned invalid JSON: {exc}") from exc

    games = payload.get("response", {}).get("games")
    if games is None:
        raise SystemExit(
            "Steam response did not include a games list. "
            "Check STEAM_API_KEY, STEAM_ID, and profile game details visibility."
        )
    return games


def to_record(game: dict) -> dict | None:
    playtime_minutes = int(game.get("playtime_forever") or 0)
    if playtime_minutes < MIN_PLAYTIME_MINUTES:
        return None

    app_id = int(game["appid"])
    hours = round(playtime_minutes / 60, 1)
    return {
        "appId": app_id,
        "title": game.get("name") or f"App {app_id}",
        "playtimeHours": hours,
        "playtimeMinutes": playtime_minutes,
        "image": BANNER_URL.format(appid=app_id),
        "platform": "Steam",
    }


def main() -> int:
    api_key = require_env("STEAM_API_KEY")
    steam_id = require_env("STEAM_ID")

    records = [record for game in fetch_owned_games(api_key, steam_id) if (record := to_record(game))]
    records.sort(key=lambda item: item["playtimeMinutes"], reverse=True)

    OUTPUT_PATH.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(records)} games to {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
