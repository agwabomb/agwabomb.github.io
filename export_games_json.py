import os
import json
import base64
import getpass
import requests


# ============================================================
# 기본 설정
# ============================================================

BASE_URL = "https://api.steampowered.com"
OUTPUT_FILE = "custom-games.json"


# ============================================================
# 1. Steam WebAPI Token 가져오기
# ============================================================

def get_token():
    """
    환경변수 STEAM_WEBAPI_TOKEN이 있으면 사용하고,
    없으면 터미널에서 직접 입력받는다.

    getpass를 사용하기 때문에 입력한 토큰이 화면에 표시되지 않는다.
    """

    token = os.environ.get("STEAM_WEBAPI_TOKEN")

    if token:
        return token.strip()

    print()
    print("Steam WebAPI Token이 필요합니다.")
    print("Steam 로그인 후 아래 주소에서 webapi_token을 가져오세요.")
    print()
    print("https://store.steampowered.com/pointssummary/ajaxgetasyncconfig")
    print()

    token = getpass.getpass("webapi_token: ").strip()

    if not token:
        raise RuntimeError("Steam WebAPI Token이 입력되지 않았습니다.")

    return token


# ============================================================
# 2. Token에서 SteamID64 가져오기
# ============================================================

def get_steam_id_from_token(token):
    """
    webapi_token은 JWT 형식이므로 payload 부분을
    로컬에서만 디코딩해서 SteamID64(sub)를 가져온다.

    토큰 자체를 외부 서버에 보내지 않는다.
    """

    try:
        parts = token.split(".")

        if len(parts) != 3:
            raise ValueError("JWT 형식이 아닙니다.")

        payload = parts[1]

        # Base64 URL padding 보정
        payload += "=" * (-len(payload) % 4)

        decoded = base64.urlsafe_b64decode(payload)

        data = json.loads(decoded.decode("utf-8"))

        steam_id = data.get("sub")

        if not steam_id:
            raise ValueError("Token에서 SteamID를 찾을 수 없습니다.")

        return str(steam_id)

    except Exception as e:
        raise RuntimeError(
            f"SteamID를 Token에서 가져오지 못했습니다: {e}"
        )


# ============================================================
# 3. 기존 JSON의 사용자 입력 정보 불러오기
# ============================================================

def load_existing_games():
    """
    기존 steam_games.json이 있다면 읽어서
    genre / comment / blogUrl 등의 사용자 입력을 보존한다.

    AppID를 기준으로 게임을 매칭한다.
    """

    if not os.path.exists(OUTPUT_FILE):
        return {}

    try:
        with open(
            OUTPUT_FILE,
            "r",
            encoding="utf-8"
        ) as f:
            old_games = json.load(f)

    except (json.JSONDecodeError, OSError):
        print("   기존 JSON을 읽을 수 없어 새로 생성합니다.")
        return {}

    old_games_by_appid = {}

    for game in old_games:

        appid = game.get("appId")

        if appid is not None:
            old_games_by_appid[int(appid)] = game

    print(
        f"   기존 JSON에서 {len(old_games_by_appid):,}개의 "
        f"게임 정보를 불러왔습니다."
    )

    return old_games_by_appid


# ============================================================
# 시작
# ============================================================

print()
print("================================")
print("Steam 게임 정보 업데이트")
print("================================")


# ============================================================
# Token
# ============================================================

TOKEN = get_token()

print()
print("Token에서 SteamID를 확인하는 중...")

MY_STEAM_ID = get_steam_id_from_token(TOKEN)

print(f"   SteamID: {MY_STEAM_ID}")


# ============================================================
# 기존 데이터
# ============================================================

print()
print("기존 사용자 입력 정보를 확인하는 중...")

old_games = load_existing_games()


# ============================================================
# 1. Steam Family 정보
# ============================================================

print()
print("1. Steam Family 정보를 가져오는 중...")

url = f"{BASE_URL}/IFamilyGroupsService/GetFamilyGroupForUser/v1/"

params = {
    "access_token": TOKEN,
}

response = requests.get(
    url,
    params=params
)

response.raise_for_status()

family_data = response.json()

family_groupid = family_data["response"]["family_groupid"]

print(f"   Family Group ID: {family_groupid}")


# ============================================================
# 2. Family Library
# ============================================================

print()
print("2. Family Library 게임 목록을 가져오는 중...")

url = f"{BASE_URL}/IFamilyGroupsService/GetSharedLibraryApps/v1/"

params = {
    "access_token": TOKEN,
    "family_groupid": family_groupid,
}

response = requests.get(
    url,
    params=params
)

response.raise_for_status()

library_data = response.json()

apps = library_data["response"]["apps"]

print(f"   Family Library 게임 수: {len(apps):,}")


# ============================================================
# 3. Family 전체 플레이타임
# ============================================================

print()
print("3. 플레이타임 정보를 가져오는 중...")

url = f"{BASE_URL}/IFamilyGroupsService/GetPlaytimeSummary/v1/"

params = {
    "access_token": TOKEN,
    "family_groupid": family_groupid,
}

response = requests.post(
    url,
    params=params
)

response.raise_for_status()

playtime_data = response.json()

entries = playtime_data["response"].get(
    "entries",
    []
)

print(
    f"   전체 가족 플레이 기록 수: {len(entries):,}"
)


# ============================================================
# 4. 내 플레이 기록만 추출
# ============================================================

print()
print("4. 내 플레이 기록을 추출하는 중...")

my_entries = [
    entry
    for entry in entries
    if str(entry.get("steamid")) == MY_STEAM_ID
]

print(
    f"   내 플레이 기록 수: {len(my_entries):,}"
)


# ============================================================
# 5. AppID별 플레이타임 정리
# ============================================================

playtime_by_appid = {}

for entry in my_entries:

    appid = int(entry["appid"])

    seconds = int(
        entry.get("seconds_played", 0)
    )

    playtime_by_appid[appid] = {
        "seconds": seconds,
        "minutes": round(seconds / 60),
        "hours": round(seconds / 3600, 2),
    }


# ============================================================
# 6. 게임 정보 결합
# ============================================================

print()
print("5. 게임 정보를 업데이트하는 중...")

games = []

for app in apps:

    appid = int(app["appid"])

    # 내 플레이 기록이 없는 게임은 제외
    if appid not in playtime_by_appid:
        continue

    # Steam에서 가져온 게임 이름
    title = app.get("name", "")

    playtime = playtime_by_appid[appid]

    # --------------------------------------------------------
    # 기존 JSON에 있던 사용자 입력 정보
    # --------------------------------------------------------

    old_game = old_games.get(appid, {})

    genre = old_game.get("genre", [])
    comment = old_game.get("comment", "")
    blog_url = old_game.get("blogUrl", "")

    # --------------------------------------------------------
    # 새로운 게임 데이터
    # --------------------------------------------------------

    game = {
        "appId": appid,

        "title": title,

        # Steam에서 새로 가져온 플레이타임
        "playtimeHours": playtime["hours"],
        "playtimeMinutes": playtime["minutes"],

        "image": (
            f"https://shared.fastly.steamstatic.com/"
            f"store_item_assets/steam/apps/{appid}/header.jpg"
        ),

        "platform": "Steam",

        # 기존 사용자 입력 보존
        "genre": genre,
        "comment": comment,
        "blogUrl": blog_url,
    }

    games.append(game)


# ============================================================
# 7. 플레이타임 순서로 정렬
# ============================================================

games.sort(
    key=lambda game: game["playtimeHours"],
    reverse=True
)


# ============================================================
# 8. JSON 저장
# ============================================================

print()
print("6. JSON 파일을 저장하는 중...")

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        games,
        f,
        ensure_ascii=False,
        indent=2
    )


# ============================================================
# 완료
# ============================================================

print()
print("================================")
print("완료!")
print("================================")

print(f"게임 수: {len(games)}")
print(f"파일: {OUTPUT_FILE}")

print()
print("플레이타임 TOP 10")
print("--------------------------------")

for game in games[:10]:

    print(
        f'{game["playtimeHours"]:8.2f} 시간 | '
        f'{game["title"]}'
    )

print()
print("기존 genre / comment / blogUrl은 보존되었습니다.")