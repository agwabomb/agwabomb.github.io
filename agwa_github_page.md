# PROJECT CONTEXT PACK

이 문서는 후속 AI가 `agwabomb.github.io`의 **현재 유효한 상태**를 기준으로 답하고 수정하기 위한 핸드오프 팩이다. 과거 마이그레이션 대화의 미완 체크리스트가 아니라, 2026-09-19 저장소 스냅샷이다.

작업 시 루트의 `CONTEXT.md`(Cursor용 짧은 스냅샷)와 `.cursorrules`를 함께 본다. 둘과 이 팩이 어긋나면 **코드·데이터 파일을 우선**한다.

---

## 0. Document Metadata

* **Project name:** `agwabomb.github.io` (GitHub Pages, origin: `https://github.com/agwabomb/agwabomb.github.io.git`)
* **표시 핸들:** agwabomb · 게임 시스템 & 레벨 기획자
* **Context Pack version:** 2.0.0
* **작성 기준 날짜:** 2026-09-19
* **이관 대상 AI:** Cursor / Claude / ChatGPT 등
* **근거:** 현재 저장소 파일 (`index.html`, `js/*`, `scripts/*`, JSON, `posts/*`). 구 캡처 PDF·스크린샷·마이그레이션 프롬프트는 역사적 배경일 뿐 현재 스펙이 아니다.

---

## 1. PROJECT OVERVIEW

### 1.1 한 줄 설명

천문우주학 연구자 출신 게임 시스템 & 레벨 기획자의 GitHub Pages 정적 포트폴리오. 빌드 없는 HTML/JS + Tailwind CDN.

### 1.2 목적

* 연구자적 오차 통제·가설 검증을 엔진 그레이박스/프로토타입으로 증명하는 취업 포트폴리오.
* 가족 공유 포함 Steam 플레이타임 + 수동 기획 분석평을 하나의 Playlist(`#games`)로 보여 준다.

### 1.3 현재 단계

**4대 해시 SPA와 데이터 파이프라인은 구현·가동 중.** 원페이지→탭 분리, Career 세로 타임라인, Steam/커스텀 병합 렌더는 코드에 반영되어 있다. 남은 것은 주로 콘텐츠(실기 GIF/증빙 이미지)와 운영 주의사항이다.

---

## 2. USER REQUIREMENTS (유효 제약)

반드시 유지할 것:

* GitHub Pages 정적 호스팅. Node/Vite/Webpack/React/Vue 도입 금지.
* 상단 4뷰: About Me / Projects / Playlist / Career. 해시 `#about` `#projects` `#games` `#career`.
* Projects 2단계: 그리드 카드 → 상세 기획 포스트.
* Playlist: 플레이타임 **1시간 이상만** 표시.
* 장르 필터: 12대 공식 장르 + `전체`. **`Array.filter` + `genre.includes`**. `find`/조기 return으로 1건만 남기지 말 것.
* 게임 카드 본문에 **장르 텍스트/뱃지 금지**. 배너, 타이틀, 플레이타임, 플랫폼, 코멘트, 분석 링크만.
* 동일 게임 병합 시 플레이타임은 **더 긴 쪽**. `comment`/`blogUrl`은 **커스텀 우선**, 없으면 스팀 레코드 값.
* Career: 세로 타임라인 (데스크톱: 좌 YYYY.MM · 중앙 실선/노드 · 우 카드).

바꾸면 안 되는 카피·체계:

* USP: *"방대한 데이터 속 오차를 줄여가던 연구자적 사고로 도파민 공식을 설계하는 게임 기획자"*
* 12대 장르: `["액션", "슈팅", "RPG", "전략", "어드벤처", "퍼즐", "시뮬레이션", "생존", "카드", "공포", "리듬", "캐주얼"]`
* 다크 슬레이트 + Cyan/Indigo 포인트 (Tailwind Slate, `bg-slate-950`).

원하지 않는 것:

* 카드 안 장르 나열.
* GitHub Actions 자정 스팀 크롤 / 구 `steam-games.json` 파이프라인 부활.
* 사용자가 적은 기획 코멘트·블로그 링크 유실.

---

## 3. CURRENT STATE

### 라이브 기능 (코드 확인됨)

* 단일 `index.html` + `js/app.js` 해시 SPA. 기본 해시 `#about`. 별칭 `#archive`/`#playlist` → games, `#contact` → about. 뷰 전환 시 `scrollTo(0,0)`, 활성 GNB 시안 언더라인, 모바일 햄버거(`lg` 미만).
* **About:** USP, 학력(연세대 천문우주 학·석사), 스택 뱃지, Contact/GitHub/블로그/itch.io, 철학 4장(교전 순환 동선 · 상태 머신 · 난이도 곡선 · 가설 검증형 밸런싱). 카피는 `js/site-data.json`.
* **Projects:** `js/projects-data.js` 메타 + `posts/{id}.md` 본문을 marked.js(CDN 13.0.3)로 파싱. 라우트 `#projects/{id}`. 모달이 아니라 같은 섹션에서 목록/상세 토글. 목록 복귀는 `#projects`, 상세에서 Escape. 대표작 `snowball`, `gravita`.
* **Playlist:** `Promise.all`로 `steam_games.json` + `custom_games.json` fetch 후 병합. 상단 13버튼(`전체`+12대) + 「기획 분석글 있는 게임만 보기」. 카드에 장르 없음.
* **Career:** `js/careers-data.js`의 `const careers` → `window.CAREERS`를 세로 타임라인으로 렌더. 현재 4항, 배열 위=과거·아래=최근. 학사 전용 칸 없음(석사 RESEARCH에 포함). 빈 `image`/`links`는 미렌더.
* Steam 수집: `scripts/export_games_json.py` → 루트 `steam_games.json` (현재 약 1407앱, 그중 1h+ 약 218). `.cursorignore`가 이 JSON을 인덱싱에서 가림. 사이트 fetch 경로이므로 파일은 유지.

### 폐기되어 더 이상 “할 일”이 아닌 것

* 원페이지 4칸 블록 Career → 이미 세로 타임라인으로 교체됨.
* `steam_games.json` 미연동 / 장르 1개만 나오는 버그 → `js/app.js`에서 `Array.filter`로 구현됨.
* `OUTPUT_FILE = "../custom-games.json"` → 현재 `OUTPUT_FILE = "../steam_games.json"`.
* `.github/workflows/update-steam.yml`, `scripts/fetch_steam.py` 소스, `steam-games.json`, `custom-games.json` → 저장소에 없음. **재생성 금지.**
* 프로젝트 본문을 JS 객체 vs 마크다운 중 택일 → **둘 다 사용**(메타 JS + 본문 MD)으로 확정됨.

### 정상 경로의 폴백

* `steam_games.json` fetch 실패 시 `js/app.js`의 `FALLBACK_STEAM_GAMES` (소수 샘플).
* `custom_games.json` fetch 실패 시 `js/site-data.json`의 `fallbackCustomGames`.
* `file://`로 열면 JSON/MD fetch가 실패한다. 로컬은 `python -m http.server 4173`.

---

## 4. PROJECT STRUCTURE

현재 실제 트리 (루트에 `projects-data.js`가 있지 않다. `js/` 아래다):

```text
agwabomb.github.io/
├── .cursorrules
├── .cursorignore              # steam_games.json, assets/, 이미지 바이너리 인덱싱 제외
├── .gitignore                 # venv, __pycache__, .env 등
├── CONTEXT.md                 # Cursor용 짧은 현재 스냅샷 (사용자 “컨텍스트 갱신” 요청 시에만 수정)
├── agwa_github_page.md        # 이 팩
├── README.md
├── index.html                 # 마크업, 타임라인 CSS, 뷰 컨테이너, CDN 스크립트
├── steam_games.json           # export_games_json.py 결과 (대용량, 수동 편집 지양)
├── custom_games.json          # 수동 기획 분석평 (comment/blogUrl 보존 필수)
├── js/
│   ├── app.js                 # 라우팅, 병합/필터/카드, Career 렌더, 포스트 fetch
│   ├── site-data.json         # 프로필·철학·UI 문구, fallbackCustomGames (Career 배열 없음)
│   ├── projects-data.js       # window.PROJECTS 카드/헤더 메타
│   └── careers-data.js        # const careers → window.CAREERS
├── posts/
│   ├── snowball.md
│   └── gravita.md
├── scripts/
│   ├── export_games_json.py
│   └── write_site_data.py     # site-data.json 재생성기. Career는 쓰지 않음
├── assets/
│   ├── favicon.ico            # 현재 index는 data URI 파비콘 사용 (이 파일 미참조)
│   └── img/
│       ├── avataaars.svg      # About 아바타 (사용 중)
│       ├── projects/          # 커버·다이어그램 SVG 슬롯 (사용 중)
│       └── portfolio/         # 구 템플릿 PNG. 현재 HTML/JS에서 미참조
└── (없음) assets/career/      # 스키마상 증빙 슬롯이나 폴더는 아직 없음
```

존재하지 않으며 다시 만들지 말 것: `.github/workflows/update-steam.yml`, `scripts/fetch_steam.py`, `scripts/scrape_profile_games.py`, `steam-games.json`, `custom-games.json`.

잔존 쓰레기(기능에 영향 없음): `scripts/__pycache__/fetch_steam.cpython-313.pyc`.

### 파일별 역할

| 경로 | 역할 | 수정 시 |
| --- | --- | --- |
| `index.html` | 셸, 뷰 섹션, Career CSS, 스크립트 로드 순서 | 프레임워크로 갈아엎지 말 것 |
| `js/app.js` | 동작 전부 | 장르 `Array.filter` 유지, 카드에 장르 넣지 말 것 |
| `js/projects-data.js` | 프로젝트 메타 (`id`, `post`, `cover`, `links`…) | 새 작품 = 여기 + `posts/{id}.md` |
| `js/careers-data.js` | 타임라인 단일 소스 | 배열 순서 = 화면 순서 |
| `js/site-data.json` | About/UI 카피 | Career 이력을 여기 넣지 말 것 |
| `posts/*.md` | 상세 본문·figure | 이미지 경로는 `assets/img/projects/` |
| `custom_games.json` | 수동 분석평 | comment/blogUrl/genre 덮어쓰기 금지 |
| `steam_games.json` | 스팀 정형 데이터 | 스크립트로만 갱신. 기존 comment/blogUrl 보존 |
| `scripts/export_games_json.py` | Family+Owned 수집, 12대 매핑 | 출력은 루트 `steam_games.json`이어야 함 |
| `scripts/write_site_data.py` | site-data 재생성, custom을 fallback에 복사 | 실행하면 `site-data.json` UI 문구도 스크립트 값으로 덮임 |

---

## 5. TECHNICAL STACK

* HTML5, Vanilla ES6+, Python 3
* Tailwind CSS CDN (`cdn.tailwindcss.com`), marked.js CDN
* 폰트: Outfit + Pretendard Variable
* 호스팅: GitHub Pages, 백엔드/DB 없음
* 포트폴리오 엔진: UE5 Landscape (Snowball), Unity 2D WebGL (Gravita)
* Steam: `IFamilyGroupsService` (그룹/공유 라이브러리/플레이타임) + `IPlayerService/GetOwnedGames` (본인 구매 분 플레이타임 보정) + 상점 HTML `app_tag` 스크래핑
* Python: `requests`, `re`, `json`, `base64`, `getpass`, `time`, `os`
* 토큰: 환경변수 `STEAM_WEBAPI_TOKEN` 또는 콘솔 `getpass`

---

## 6. ARCHITECTURE / DATA FLOW

### 6.1 Steam 수집 (로컬 수동)

```text
(권장) cd scripts && python export_games_json.py
  → 토큰 (env 또는 getpass) → JWT에서 SteamID
  → GetFamilyGroupForUser
  → GetSharedLibraryApps (구매 + 가족 공유)
  → GetOwnedGames 로 본인 구매 분 분 단위 플레이타임
  → GetPlaytimeSummary 로 가족 공유 분 초 단위 플레이타임
  → appId당 더 긴 시간 채택
  → 상점 페이지 태그 (기존 tags 캐시, FORCE_REFRESH_TAGS로 강제 갱신)
  → TAG_TO_12 가중치 → genre(12대)
  → 기존 steam_games.json의 comment/blogUrl 보존
OUTPUT: ../steam_games.json   # CWD가 scripts/ 일 때 저장소 루트
```

`OUTPUT_FILE`은 **스크립트 위치가 아니라 현재 작업 디렉터리 상대경로**다. 저장소 루트에서 `python scripts/export_games_json.py`를 치면 상위 폴더에 쓰일 수 있다.

`INCLUDE_UNPLAYED = True`라 0시간 앱도 JSON에 들어간다. 화면에서는 1h+만 보여 준다.

### 6.2 Playlist 프론트

```text
#games
  Promise.all([ steam_games.json, custom_games.json ])
  병합 키: appId 숫자 일치, 없으면 title 소문자 일치
  playtimeHours = max(스팀, 커스텀)   # 커스텀은 "11.37h" 문자열도 파싱
  comment/blogUrl = 커스텀 비어 있지 않으면 커스텀, 아니면 스팀
  image = 스팀 image → custom.image → custom.customImage
  genre = 스팀 12대가 있으면 그것, 없으면 커스텀을 GENRE_ALIASES로 12대 매핑
  커스텀 전용(스팀에 없는) 타이틀은 콘솔 포함 그대로 한 장 추가
  필터: playtimeHours >= 1 → 장르 버튼 → blogOnly면 blogUrl 있는 것만
  정렬: 플레이타임 내림차순
  카드: 이미지, 제목, {n}h, 플랫폼 뱃지, 코멘트 인용, 분석 링크
        ※ 장르 문자열 렌더 금지
```

### 6.3 Projects

`window.PROJECTS` 그리드 → 클릭 시 `#projects/{id}` → `fetch(project.post)` → `marked.parse`. 이미지 슬롯은 마크다운 `<figure>`의 `assets/img/projects/*.svg` (실기 GIF로 교체하는 주석이 본문에 있음).

### 6.4 Career

`window.CAREERS`만 사용. `site-data.json`에 career 배열을 두지 않는다. 스키마: `period`, `category`, `title`, `subtitle`, `description`, `details[]`, `image`, `links[{label,url}]`.

현재 4항:

1. `2022.03 ~ 2025.08` RESEARCH — 석사 오차 통제 · CASCADE
2. `2025.08` EDUCATION / THESIS — 석사 졸업, A&A 주저자 SCIE ([DOI](https://doi.org/10.1051/0004-6361/202557054), [arXiv](https://arxiv.org/abs/2510.00400)), Oxford 공동 연구
3. `2025.10 ~` TRANSITION — 그레이박스 · 역기획 블로그
4. `2025.10 ~` PRACTICE — Snowball & Gravita (해시 기획서, itch.io). 이미지만 `assets/img/projects/gravita-cover.svg`

모바일(`<768px`): 기간이 카드 위, 레일은 왼쪽. 데스크톱: 좌 기간 / 중 레일 / 우 카드.

---

## 7. IMPORTANT DESIGN DECISIONS

### Decision 1: 해시 SPA, 번들러 없음

* GitHub Pages 404와 중복 fetch를 피하려고 단일 `index.html` + hash.
* 변경 불가.

### Decision 2: 로컬 Family 스크립트 (Actions 폐기)

* 공식 `GetOwnedGames`만 쓰면 가족 공유가 빠진다. 공개 프로필 크롤도 가족 공유를 안 내려준다.
* **현재 스크립트는 Family API가 본체이고, GetOwnedGames는 본인 구매 분 0시간 버그 보정용으로 함께 쓴다.** Actions용 GetOwnedGames 단독 파이프라인과는 다른 것이다.
* 변경 불가.

### Decision 3: 카드에서 장르 숨김

* 12대는 필터 전용. 카드는 플레이타임·플랫폼·코멘트·링크에 시선.
* 사용자 재요청 전까지 변경 불가.

### Decision 4: Career 세로 타임라인

* 연구 → 역기획 → 엔진 프로토타입 서사.
* 데이터는 `js/careers-data.js`만.

### Decision 5: 프로젝트 메타 JS + 본문 마크다운

* 카드/헤더는 `js/projects-data.js`, 줄글·figure는 `posts/{id}.md` + marked.js.
* 이 하이브리드가 확정안이다. 둘 중 하나로 되돌리지 말 것.

---

## 8. REJECTED / ABANDONED APPROACHES

다시 도입하지 말 것.

### 1. GitHub Actions 자정 `fetch_steam.py` + `update-steam.yml` → `steam-games.json`

가족 공유 누락, 장르 없음. 소스 파일은 이미 저장소에서 제거됨.

### 2. 스팀 커뮤니티 프로필 크롤 (`scrape_profile_games.py`)

가족 공유 미포함 + React 프로필로 DOM/XML 파싱 불가.

### 3. `.cursor/rules/*.mdc` 분할

단일 정적 사이트라 루트 `.cursorrules` + `.cursorignore`만 유지.

### 4. Career 4칸 그리드 블록

타임라인으로 대체 완료. 블록 레이아웃 복원 금지.

### 5. 레거시 파일명

하이픈 `steam-games.json` / `custom-games.json` 을 언더스코어 파일과 혼용하지 말 것.

---

## 9. KNOWN PROBLEMS / GAPS (현재)

기능 버그로 남아 있는 “장르 1개만 표시”, “출력이 custom-games.json” 은 **해결됨**. 아래만 현재 갭이다.

### Gap 1: `export_games_json.py` 출력 경로가 CWD 상대

* `OUTPUT_FILE = "../steam_games.json"`. `scripts/`에서 실행해야 루트에 쌓인다.
* 루트에서 실행하면 저장소 바깥에 쓸 수 있다.
* 해결 여부는 코드 미수정. 실행 습관으로 우회 중.

### Gap 2: `site-data.json` fallbackCustomGames 구버전

* 라이브 `custom_games.json`은 64.0, Bear's Restaurant, Ghost Trick, I Expect You To Die (모두 Steam + 링크).
* `js/site-data.json` fallback은 예전 샘플(Arc Raiders PS5, Ghost Trick Switch, Ori, Hades)이 남아 있다.
* `custom_games.json` fetch가 성공할 때는 쓰이지 않음. `scripts/write_site_data.py`를 돌리면 fallback은 맞춰지지만 UI 카피 일부도 스크립트 값으로 덮일 수 있음.

### Gap 3: 프로젝트/커리어 미디어가 슬롯 상태

* `posts/*.md` figure는 SVG 플레이스홀더. 본문 주석이 실기 PNG/GIF 교체를 안내.
* `assets/career/` 없음. Career `image`는 PRACTICE 외 빈 문자열.

### Gap 4: 분석평 저장 위치가 두 파일에 갈림

* `steam_games.json`에 comment+blogUrl이 **7건** (ARC Raiders `/14`, Escape From Duckov `/12`, ZERO Sievert `/13`, 그리고 커스텀과 겹치는 4건).
* `custom_games.json`에는 그 중 4건만 있음.
* 병합은 스팀 코멘트도 보여 주므로 화면에는 7건 분석이 나온다. 스크립트/AI가 `custom_games.json`만 보호하고 스팀 JSON 코멘트를 지우면 `/12` `/13` `/14`가 사라진다.

### Gap 5: 미사용 에셋

* `assets/img/portfolio/*.png` — 구 포트폴리오 템플릿, 현재 뷰 미참조.
* `assets/favicon.ico` — index 미참조.

---

## 10. PREVIOUSLY SOLVED PROBLEMS

### 가족 공유 누락 + 장르 없음

Family Groups API + 상점 태그 매핑 스크립트로 해결. 본인 구매 0시간 문제는 GetOwnedGames 병합으로 스크립트에 이미 보정됨.

### Playlist 장르 클릭 시 1개만 표시

원인 후보는 `find`/덮어쓰기 `innerHTML`/조기 return. 현재 `filteredGames()`가 `state.games.filter(...)` 후 그리드 전체를 다시 그린다.

### 해시 4탭 / 타임라인 / 프로젝트 상세

`index.html` 섹션 + `js/app.js` 라우터 + Career CSS + marked 포스트로 반영됨.

### 출력 파일명을 custom-games.json으로 쓰던 실수

현재 스크립트는 `steam_games.json`을 가리킨다 (CWD 전제만 남음).

---

## 11. CURRENT TODO

기능 백로그의 Critical 항목(경로 수정, 병합 렌더, 타임라인, 포스트 포맷 결정, 레거시 삭제)은 **완료**다. 추측으로 새 기능을 넣지 말 것. 사용자 지시가 없으면 아래를 임의 구현하지 말 것.

### 콘텐츠 (사용자가 원할 때)

* Snowball/Gravita 실기 캡처·GIF로 SVG 슬롯 교체.
* Career 증빙 이미지가 생기면 `assets/career/`(또는 합의된 경로) + `image` 필드.

### 데이터 위생 (지시 시에만)

* fallbackCustomGames를 현 `custom_games.json`에 맞출지.
* 스팀 전용 분석평 3건을 `custom_games.json`으로 옮길지(옮기더라도 스팀 쪽 코멘트를 함부로 지우지 말 것).
* `OUTPUT_FILE`을 `Path(__file__).resolve().parents[1] / "steam_games.json"`처럼 스크립트 기준 절대경로로 고정할지.

### 금지

* GitHub Actions 스팀 워크플로, `fetch_steam.py`, 하이픈 JSON 파일명 재생성 금지.

---

## 12. NEXT STEP

사이트 골격은 이미 동작한다. 다음 작업은 사용자가 지정한 콘텐츠/카피/데이터 수정이다. 모호하면 구현하지 말고 방향을 묻는다.

로컬 확인:

```bash
python -m http.server 4173
```

`#about` `#projects` `#projects/snowball` `#projects/gravita` `#games` `#career` 및 장르 필터·분석글 토글을 보면 된다.

---

## 13. USER PREFERENCES FOR WORKING WITH AI

* 기술 한계를 먼저 말하고, 붙여넣을 수 있는 구체적 변경안을 준다.
* 사용자가 쓴 `comment`/`blogUrl` 보존이 최우선.
* 안 되는 것(스팀 프로필 크롤 등)은 원인과 함께 거절한다.
* 카피는 게이머 리뷰체가 아니라 시스템 룰, 상태 머신, 동선, 튜토리얼라이제이션, 페이싱, 가설 검증 톤.
* `.cursorrules`: 남은 작업이 모호하면 추측 구현 금지. `CONTEXT.md`는 사용자가 “작업 정리/컨텍스트 갱신”을 요청할 때만 갱신.

---

## 14. HISTORICAL CONTEXT (왜 이렇게 됐는가)

* Slay the Spire, Hollow Knight 등 핵심 플레이가 가족 공유라 `GetOwnedGames`/공개 프로필만으로는 아카이브가 성립하지 않았다 → Family 토큰 스크립트.
* 장르 1건 버그 이후 `.cursorrules`에 `Array.filter` 강제.
* 블록형 Career가 나열로 보여 세로 타임라인으로 바꿨고, 그 개편은 **이미 반영됨**.

---

## 15. DOMAIN KNOWLEDGE

### 15.1 기획 포지셔닝

연세대 천문우주 학·석사, 대규모 시뮬레이션 오차 통제, SCIE 주저자. USP는 연구자적 사고로 도파민 공식을 설계하는 것.

**Snowball Battleground (Unreal Landscape, 진행 중)**  
느린 곡사 + 긴 TTK. 외곽 산사면, 중앙 이중 능선 협곡으로 교전 순환 동선. 투명 벽 대신 지형으로 외곽을 닫음.

**Gravita (Unity 2D WebGL, 프로토타입, [itch.io/gravita](https://agwabomb.itch.io/gravita))**  
4방향 중력 상태 머신, 5단계 비언어적 튜토리얼, 1페이즈 안전지대를 2페이즈 낙사 구멍으로 회수하는 난이도 곡선. Grazing/버퍼는 밸런싱 이슈로 조정됨.

### 15.2 Steam Family API

* `https://api.steampowered.com/IFamilyGroupsService/`
* `GetFamilyGroupForUser/v1`, `GetSharedLibraryApps/v1`, `GetPlaytimeSummary/v1`
* 토큰 확인: `https://store.steampowered.com/pointssummary/ajaxgetasyncconfig`

---

## 16. IMPORTANT CONSTRAINTS

* Vanilla HTML/JS + Tailwind CDN만. React/Vue/Next/번들러 금지.
* `custom_games.json`의 comment, blogUrl, genre를 빈 값으로 덮지 말 것.
* `steam_games.json` 재추출 시 기존 comment/blogUrl 보존 (스크립트가 `load_existing_games()`로 이미 함).
* 장르 필터는 `Array.filter`. 카드에 장르 뱃지 금지.
* 기획 용어 유지: 코어 루프, 상태 머신, Pacing, 튜토리얼라이제이션, 시선 유도, 핫스팟.
* 레거시 스팀 Actions/크롤 파일 재생성 금지.

---

## 17. DO NOT BREAK

* USP 문구, 학력(연세대 천문우주 학·석사), 메일 `zaqxsw0517b@gmail.com`
* 해시 4뷰 및 `#projects/{id}`
* 12대 장르 가중치 맵 (`TAG_TO_12`)을 임의로 흔들지 말 것
* `custom_games.json` 및 `steam_games.json`의 분석평·링크
* Career 데이터 소스 (`js/careers-data.js`)

---

## 18. OPEN QUESTIONS

포스팅 포맷, 4탭 구조, 타임라인, Family 스크립트 전환은 **닫힌 결정**이다.

남아 있는 선택(사용자 확인 전 구현 금지):

* 분석평 원본을 `custom_games.json`으로 일원화할지, 스팀 JSON 7건을 그대로 둘지.
* `OUTPUT_FILE`을 스크립트 기준 절대경로로 고칠지.
* Career/프로젝트 실기 미디어를 언제 넣을지.

토큰 무인 실행: **이미** `STEAM_WEBAPI_TOKEN`을 지원한다. 추가 자동화(GitHub Actions)는 거절된 접근이다.

---

## 19. IMPORTANT REFERENCES

* 사이트 원격: `https://github.com/agwabomb/agwabomb.github.io`
* 블로그: `https://blanktie.tistory.com`
* Snowball 관련 글: `https://blanktie.tistory.com/11`
* 분석글 예: `/7` 64.0, `/8` Bear's Restaurant, `/9` Ghost Trick, `/10` I Expect You To Die, `/12` Duckov, `/13` ZERO Sievert, `/14` ARC Raiders
* itch.io: `https://agwabomb.itch.io` (Gravita: `/gravita`)
* GitHub: `https://github.com/agwabomb`
* 메일: `mailto:zaqxsw0517b@gmail.com`
* 스팀 헤더 CDN: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appid}/header.jpg`

---

## 20. HANDOFF SUMMARY

### 프로젝트

게임 시스템 & 레벨 기획자 GitHub Pages 정적 포트폴리오 (`agwabomb.github.io`).

### 현재 상태

4탭 해시 SPA, Steam+커스텀 병합 Playlist, 세로 Career 타임라인, 마크다운 프로젝트 포스트가 **동작 중**. 파이썬 수집 스크립트와 루트 `steam_games.json`도 존재한다.

### 가장 중요한 유지 조건

1. 병합 렌더 + 카드 장르 숨김 + `Array.filter` 12대 필터.
2. 분석평(`comment`/`blogUrl`) 유실 금지 — 커스텀 **및** 스팀 JSON 기존 값.
3. 정적 Vanilla 구조와 USP/학력 카피.

### 현재 가장 중요한 “문제”

신규 기능 미구현이 아니라, (a) 스크립트 출력 경로의 CWD 의존, (b) fallback 커스텀 데이터 구버전, (c) 실기 미디어 미교체, (d) 분석평이 JSON 두 곳에 분산.

### 다음 작업

사용자 지시 기반 콘텐츠/데이터 수정. 마이그레이션 체크리스트를 다시 실행하지 말 것.

### 절대로 하지 말 것

1. React/Vue/Node 빌드로 복잡화.
2. 게임 카드에 장르 태그 재노출.
3. 기획 코멘트·링크 삭제/공란화.
4. GitHub Actions 스팀 크롤 및 레거시 파일명 부활.

---

## 21. CONFIDENCE / UNCERTAINTY REPORT

### 확실한 정보 (파일로 확인)

* 레포 이름 `agwabomb.github.io`, 핸들 agwabomb.
* `js/projects-data.js`, `js/careers-data.js`, `posts/*.md`, marked.js 상세 뷰.
* Playlist 병합·필터·카드 UI가 `js/app.js`에 구현됨.
* `export_games_json.py`의 `OUTPUT_FILE = "../steam_games.json"`, Family+Owned+태그 매핑.
* `steam_games.json` 스키마: `appId`, `title`, `playtimeHours`, `playtimeMinutes`, `image`, `platform`, `tags`, `genre`, `comment`, `blogUrl`.
* `custom_games.json` 현재 4건(모두 Steam, 코멘트+블로그).
* Career 4항과 타임라인 CSS(모바일 스택 / md+ 3열).
* 레거시 Actions/fetch_steam 소스는 없음.

### 이 팩에서 고친, 구버전 오해

* “4탭·타임라인·병합이 아직 프롬프트만 있다” → 구현됨.
* “본문 포맷 미확정” → 메타 JS + posts MD.
* “레포가 blanktie.github.io일 수 있다” → `agwabomb.github.io`.
* “커스텀 4건이 Arc Raiders PS5 / Switch Ghost Trick / Ori / Hades” → 그건 fallback 잔재. 라이브 커스텀은 64.0 등 4건.
* “OUTPUT이 custom-games.json” → 아님.

### 추정으로 단정하지 않은 것

* 사용자가 스팀 전용 분석 3건을 커스텀으로 옮기려는지는 미확인.
* `assets/img/portfolio` 삭제 의향 미확인.
* `write_site_data.py`를 언제 다시 돌릴지 미확인.
