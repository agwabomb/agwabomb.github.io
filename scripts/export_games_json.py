import os
import json
import base64
import getpass
import requests
import time
import re

# ============================================================
# 설정
# ============================================================
BASE_URL = "https://api.steampowered.com"
OUTPUT_FILE = "../steam_games.json"  # 저장 위치

INCLUDE_UNPLAYED = True   # False면 플레이한 게임만
FORCE_REFRESH_TAGS = False  # True면 태그 전부 새로 긁음

# ============================================================
# 12대 대분류 정의 [액션, 슈팅, RPG, 전략, 어드벤처, 퍼즐, 시뮬레이션, 생존, 카드, 공포, 리듬, 캐주얼]
# ============================================================
OFFICIAL_12 = [
    "액션", "슈팅", "RPG", "전략", "어드벤처",
    "퍼즐", "시뮬레이션", "생존", "카드", "공포", "리듬", "캐주얼"
]

TAG_TO_12 = {
    # 액션 (슈팅 제외)
    "액션": ["액션"], "격투": ["액션"], "격투 게임": ["액션"],
    "핵앤슬래시": ["액션"], "플랫포머": ["액션"], "2d 플랫포머": ["액션"], "3d 플랫포머": ["액션"],
    "퍼즐 플랫포머": ["액션", "퍼즐"], "정밀 플랫포머": ["액션"], "사이드 스크롤": ["액션"],
    "메트로이드베니아": ["액션", "어드벤처"], "로그베니아": ["액션"], "스펙터클 파이터": ["액션"],
    "캐릭터 액션 게임": ["액션"], "검술": ["액션"], "무술": ["액션"], "닌자": ["액션"],
    "보스 러시": ["액션"], "빠른 진행": ["액션"], "아케이드": ["액션"], "런앤건": ["액션"],
    "beat 'em up": ["액션"], "fighting": ["액션"], "hack and slash": ["액션"],
    "platformer": ["액션"], "metroidvania": ["액션"],
    "action": ["액션"],

    # 슈팅
    "슈팅": ["슈팅"], "fps": ["슈팅"], "1인칭 슈팅": ["슈팅"], "3인칭 슈팅": ["슈팅"],
    "탑다운 슈팅": ["슈팅"], "트윈 스틱 슈팅": ["슈팅"], "탄막": ["슈팅"], "탄막 슈팅": ["슈팅"],
    "아레나 슈터": ["슈팅"], "히어로 슈터": ["슈팅"], "루터 슈터": ["슈팅"],
    "탈출 슈터": ["슈팅"], "부머 슈터": ["슈팅"], "레일 슈팅": ["슈팅"],
    "슈팅 게임": ["슈팅"], "저격": ["슈팅"], "총기 커스터마이징": ["슈팅"],
    "차량 전투": ["슈팅"], "shooter": ["슈팅"],

    # RPG
    "rpg": ["RPG"], "롤플레잉": ["RPG"], "jrpg": ["RPG"], "crpg": ["RPG"],
    "액션 rpg": ["RPG", "액션"], "전술 rpg": ["RPG", "전략"], "전략 rpg": ["RPG", "전략"],
    "턴제 rpg": ["RPG"], "파티 기반 rpg": ["RPG"], "던전 크롤러": ["RPG", "어드벤처"],
    "마법": ["RPG"], "소울라이크": ["RPG", "액션"],

    # 전략
    "전략": ["전략"], "rts": ["전략"], "실시간 전술": ["전략"], "턴제 전략": ["전략"],
    "턴제 전술": ["전략"], "턴제 전투": ["전략"], "그랜드 전략": ["전략"],
    "4x": ["전략"], "타워 디펜스": ["전략"], "전술": ["전략"], "전쟁 게임": ["전략"],
    "moba": ["전략"], "오토 배틀러": ["전략"], "군사": ["전략"], "전쟁": ["전략"],

    # 어드벤처
    "어드벤처": ["어드벤처"], "어드벤쳐": ["어드벤처"], "모험": ["어드벤처"],
    "포인트 앤 클릭": ["어드벤처"], "스토리 풍부": ["어드벤처"], "내러티브": ["어드벤처"],
    "비주얼 노벨": ["어드벤처"], "오픈 월드": ["어드벤처"], "판타지": ["어드벤처", "RPG"],
    "공상 과학": ["어드벤처"], "우주": ["어드벤처", "시뮬레이션"],

    # 퍼즐
    "퍼즐": ["퍼즐"], "논리": ["퍼즐"], "puzzle": ["퍼즐"],

    # 시뮬레이션
    "시뮬레이션": ["시뮬레이션"], "생활 시뮬": ["시뮬레이션"], "농장 시뮬": ["시뮬레이션"],
    "도시 건설": ["시뮬레이션"], "건설": ["시뮬레이션"], "경영": ["시뮬레이션"],
    "자원 관리": ["시뮬레이션"], "샌드박스": ["시뮬레이션"], "낚시": ["시뮬레이션"],
    "운전": ["시뮬레이션"], "자동차 시뮬": ["시뮬레이션"], "비행": ["시뮬레이션"],
    "레이싱": ["시뮬레이션"], "스포츠": ["시뮬레이션"], "simulation": ["시뮬레이션"],

    # 생존
    "생존": ["생존"], "오픈 월드 생존 제작": ["생존", "시뮬레이션", "어드벤처"],
    "제작": ["생존", "시뮬레이션"], "크래프팅": ["생존", "시뮬레이션"],

    # 카드
    "카드 게임": ["카드"], "덱 빌딩": ["카드"], "로그라이크 덱빌딩": ["카드", "전략"],
    "트레이딩 카드 게임": ["카드"], "card game": ["카드"],

    # 공포
    "공포": ["공포"], "생존 공포": ["공포", "생존"], "심리 공포": ["공포"],
    "좀비": ["공포", "생존", "액션"], "horror": ["공포"],

    # 리듬
    "리듬": ["리듬"], "음악": ["리듬"], "rhythm": ["리듬"], "music": ["리듬"],

    # 캐주얼
    "캐주얼": ["캐주얼"], "힐링": ["캐주얼"], "아늑한": ["캐주얼"], "귀여운": ["캐주얼"],
    "파티 게임": ["캐주얼"], "보드 게임": ["캐주얼", "전략"], "casual": ["캐주얼"], "cozy": ["캐주얼"],
}

def get_genres_from_tags(tags):
    """태그 리스트 -> 12대 장르 리스트로 변환"""
    if not tags:
        return ["캐주얼"]
    score = {g: 0 for g in OFFICIAL_12}
    for raw in tags:
        t = raw.strip().lower()
        if t in TAG_TO_12:
            for g in TAG_TO_12[t]:
                if g in score:
                    score[g] += 3
            continue
        for keyword, genres in TAG_TO_12.items():
            if len(keyword) <= 2:
                continue
            if keyword in t or t in keyword:
                for g in genres:
                    if g in score:
                        score[g] += 1
    sorted_genres = sorted([(g, s) for g, s in score.items() if s > 0], key=lambda x: x[1], reverse=True)
    result = [g for g, s in sorted_genres]
    return result if result else ["캐주얼"]

# ============================================================
# 공통 함수
# ============================================================
def get_token():
    token = os.environ.get("STEAM_WEBAPI_TOKEN")
    if token:
        return token.strip()
    print("\nhttps://store.steampowered.com/pointssummary/ajaxgetasyncconfig 에서 webapi_token 확인\n")
    token = getpass.getpass("webapi_token: ").strip()
    if not token:
        raise RuntimeError("Token이 입력되지 않았습니다.")
    return token

def get_steam_id_from_token(token):
    try:
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        data = json.loads(decoded.decode("utf-8"))
        return str(data.get("sub"))
    except Exception as e:
        raise RuntimeError(f"SteamID 추출 실패: {e}")

def load_existing_games():
    if not os.path.exists(OUTPUT_FILE):
        return {}
    try:
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            old_games = json.load(f)
    except:
        return {}
    by_id = {}
    for g in old_games:
        appid = g.get("appId")
        if appid is None:
            continue
        # 기존 파일 호환: genre에 태그가 들어있던 경우 -> tags로 마이그레이션
        # 새 파일: tags와 genre가 분리되어 있음
        tags = g.get("tags") or g.get("genre") or []
        # tags가 이미 12대 장르로만 되어있으면 원본 태그가 아니므로 다시 긁어야 함
        is_already_mapped = len(tags) > 0 and all(t in OFFICIAL_12 for t in tags)
        if is_already_mapped:
            tags = []  # 다시 긁도록 비움
        by_id[int(appid)] = {
            "comment": g.get("comment", ""),
            "blogUrl": g.get("blogUrl", ""),
            "tags": tags,
            "old_genre": g.get("genre", [])
        }
    print(f"   기존 JSON {len(by_id)}개 로드 (tags->genre 마이그레이션 적용)")
    return by_id

# 상점 태그 캐시
_tag_cache = {}
def get_store_tags(appid, session):
    if appid in _tag_cache:
        return _tag_cache[appid]
    cookies = {"birthtime": "0", "lastagecheckage": "1-January-1970", "wants_mature_content": "1"}
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    for lang in ["korean", "english"]:
        try:
            url = f"https://store.steampowered.com/app/{appid}/"
            params = {"l": lang, "cc": "kr" if lang == "korean" else "us"}
            resp = session.get(url, params=params, cookies=cookies, headers=headers, timeout=15)
            if resp.status_code != 200:
                continue
            html = resp.text
            tags = re.findall(r'class="app_tag"[^>]*>([^<]+)</a>', html)
            tags = [t.strip() for t in tags if t.strip()]
            if tags:
                seen = set()
                uniq = []
                for t in tags:
                    low = t.lower()
                    if low not in seen:
                        seen.add(low)
                        uniq.append(t)
                _tag_cache[appid] = uniq
                return uniq
        except Exception:
            time.sleep(0.5)
            continue
    _tag_cache[appid] = []
    return []

# ============================================================
# 메인 로직
# ============================================================
print("\n================================")
print("export_games_json.py - 12대 장르 분류 버전")
print("tags: 원본 상점 태그 / genre: 12대 장르 매핑")
print("================================\n")

TOKEN = get_token()
MY_STEAM_ID = get_steam_id_from_token(TOKEN)
print(f"SteamID: {MY_STEAM_ID}")

old_data = load_existing_games()

print("\n1. Family Group ID 가져오기...")
resp = requests.get(f"{BASE_URL}/IFamilyGroupsService/GetFamilyGroupForUser/v1/",
                    params={"access_token": TOKEN})
resp.raise_for_status()
family_groupid = resp.json()["response"]["family_groupid"]
print(f"   Family Group ID: {family_groupid}")

print("\n2. 전체 라이브러리 가져오기 (내 구매 + 가족공유)...")
resp = requests.get(f"{BASE_URL}/IFamilyGroupsService/GetSharedLibraryApps/v1/",
                    params={
                        "access_token": TOKEN,
                        "family_groupid": family_groupid,
                        "include_own": True,
                        "include_excluded": True,
                        "include_free": False,
                        "include_non_games": False
                    })
resp.raise_for_status()
apps = resp.json()["response"]["apps"]
print(f"   전체 앱 수: {len(apps):,}개")

print("\n3. 플레이타임 가져오기 (내 구매 + 가족공유 합치기)...")

# 3-1. 내가 직접 구매한 게임 플레이타임 (IPlayerService/GetOwnedGames)
# 이게 없으면 직접 구매한 게임은 0시간으로 표시되는 버그가 발생
print("   3-1. 내 구매 게임 플레이타임 조회 중 (GetOwnedGames)...")
try:
    resp = requests.get(f"{BASE_URL}/IPlayerService/GetOwnedGames/v1/",
                        params={
                            "access_token": TOKEN,
                            "steamid": MY_STEAM_ID,
                            "include_appinfo": True,
                            "include_played_free_games": True,
                            "include_free_sub": True
                        })
    resp.raise_for_status()
    owned_games = resp.json().get("response", {}).get("games", [])
    print(f"   -> 내 구매 게임 {len(owned_games)}개")
except Exception as e:
    print(f"   -> GetOwnedGames 실패: {e}")
    owned_games = []

playtime_by_appid = {}
for g in owned_games:
    appid = int(g["appid"])
    minutes = int(g.get("playtime_forever", 0))
    playtime_by_appid[appid] = {
        "hours": round(minutes / 60, 2),
        "minutes": minutes,
        "seconds": minutes * 60
    }

# 3-2. 가족공유 플레이타임 (GetPlaytimeSummary)
print("   3-2. 가족공유 플레이타임 조회 중 (GetPlaytimeSummary)...")
resp = requests.post(f"{BASE_URL}/IFamilyGroupsService/GetPlaytimeSummary/v1/",
                     params={"access_token": TOKEN, "family_groupid": family_groupid})
resp.raise_for_status()
entries = resp.json()["response"].get("entries", [])
my_family_entries = [e for e in entries if str(e.get("steamid")) == MY_STEAM_ID]
print(f"   -> 가족공유 내 플레이 기록: {len(my_family_entries)}개")

# 합치기: 더 큰 플레이타임으로 갱신 (둘 다 있는 경우)
for e in my_family_entries:
    appid = int(e["appid"])
    sec = int(e.get("seconds_played", 0))
    minutes = round(sec / 60)
    hours = round(sec / 3600, 2)

    existing = playtime_by_appid.get(appid)
    if existing is None or sec > existing.get("seconds", 0):
        playtime_by_appid[appid] = {
            "hours": hours,
            "minutes": minutes,
            "seconds": sec
        }

print(f"   -> 합쳐진 최종 플레이 기록: {len(playtime_by_appid)}개")
print(f"      (예: 직접 구매 150개 + 가족공유 50개 = 200개가 되어야 정상)")

print("\n4. 게임 정보 생성 (tags + 12장르 genre)...")
print(f"   INCLUDE_UNPLAYED={INCLUDE_UNPLAYED}, FORCE_REFRESH_TAGS={FORCE_REFRESH_TAGS}")

store_session = requests.Session()
target_apps = apps if INCLUDE_UNPLAYED else [a for a in apps if int(a["appid"]) in playtime_by_appid]
print(f"   대상: {len(target_apps)}개")

games = []
for idx, app in enumerate(target_apps, 1):
    appid = int(app["appid"])
    title = app.get("name", f"App {appid}")
    playtime = playtime_by_appid.get(appid, {"hours": 0.0, "minutes": 0})

    old = old_data.get(appid, {})
    comment = old.get("comment", "")
    blog_url = old.get("blogUrl", "")
    existing_tags = old.get("tags", [])

    # 태그 결정
    if FORCE_REFRESH_TAGS or not existing_tags:
        print(f"   [{idx}/{len(target_apps)}] {title} ({appid}) - 상점 태그 조회...")
        raw_tags = get_store_tags(appid, store_session)
        time.sleep(0.8)
    else:
        raw_tags = existing_tags
        print(f"   [{idx}/{len(target_apps)}] {title} ({appid}) - 기존 tags 보존 ({len(raw_tags)}개)")

    # 12대 장르로 변환 (Steam_Genre_Mapper_12 로직 내장)
    mapped_genres = get_genres_from_tags(raw_tags)

    print(f"      -> tags: {raw_tags[:6]}{'...' if len(raw_tags)>6 else ''} => genre: {mapped_genres}")

    game = {
        "appId": appid,
        "title": title,
        "playtimeHours": playtime["hours"],
        "playtimeMinutes": playtime["minutes"],
        "image": f"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appid}/header.jpg",
        "platform": "Steam",
        "tags": raw_tags,          # 변경점: 기존 genre에 있던 태그 목록은 이제 tags로
        "genre": mapped_genres,    # 변경점: tags를 기반으로 12대 장르로 분류한 결과
        "comment": comment,
        "blogUrl": blog_url
    }
    games.append(game)

games.sort(key=lambda g: g["playtimeHours"], reverse=True)

print("\n5. JSON 저장...")
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(games, f, ensure_ascii=False, indent=2)

print("\n================================")
print("완료!")
print("================================")
print(f"저장 파일: {OUTPUT_FILE}")
print(f"총 게임 수: {len(games)}")
print(f"필드 구조: appId, title, playtimeHours, tags(원본 태그), genre(12대 분류), comment, blogUrl")
print("\nTOP 10:")
for g in games[:10]:
    print(f"{g['playtimeHours']:6.1f}h | {g['title'][:25]:25} | tags={len(g['tags'])}개 | genre={g['genre']}")