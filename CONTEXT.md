# 현재 스냅샷

게임 시스템 & 레벨 기획자 GitHub Pages 포트폴리오. 빌드 없는 정적 HTML/JS + Tailwind CDN. 다크 모드(Slate 900/950, Cyan/Indigo 포인트).

## 라우팅
- 해시 SPA: `#about` · `#projects` · `#games` · `#career` (기본 `#about`)
- 프로젝트 상세: `#projects/{id}` (목록 복귀는 `#projects`)
- 별칭: `#archive`/`#playlist` → games, `#contact` → about
- 뷰 전환 시 `scrollTo(0,0)`, 활성 GNB 시안 인디케이터, 모바일 햄버거

## 뷰
- **About:** USP, 학력(연세대 천문우주 학·석사), 스택 뱃지, Contact/GitHub/블로그/itch.io, 철학 4장(교전 순환 동선 · 상태 머신 · 난이도 곡선 · 가설 검증형 밸런싱)
- **Projects:** 카드 그리드 → 마크다운 상세 포스트. Snowball Battleground(UE Landscape, 곡사/긴 TTK 교전 루프), Gravita(Unity 2D WebGL, 4방향 중력 상태 머신, itch.io)
- **Playlist:** Steam+Custom 병합 카드(`appId` 우선, 없으면 타이틀), 장르 필터(`Array.filter`), 분석글 토글
- **Career:** 세로 타임라인(좌 시기 YYYY.MM · 중앙 Slate 실선/Cyan 노드 · 우 이력 카드). 모바일은 날짜→카드 세로 스택. 학사 전용 칸은 없음(석사 RESEARCH 설명에 포함)

## Career 데이터 (현재 4항, 위=과거)
1. `2022.03 ~ 2025.08` RESEARCH — 석사과정 오차 통제 · CASCADE
2. `2025.08` EDUCATION / THESIS — 석사 졸업, A&A 주저자(SCIE, [DOI](https://doi.org/10.1051/0004-6361/202557054) / [arXiv](https://arxiv.org/abs/2510.00400)), Oxford 공동 연구
3. `2025.10 ~` TRANSITION — 그레이박스 · 역기획 블로그
4. `2025.10 ~` PRACTICE — Snowball & Gravita (기획서 해시 링크, itch.io)

스키마: `period`, `category`, `title`, `subtitle`, `description`, `details[]`, `image`, `links[{label,url}]`. 빈 `image`/`links`는 미렌더. 배열 순서가 곧 화면 순서.

## 파일
- `index.html` — 마크업/뷰 컨테이너, 타임라인 CSS
- `js/app.js` — 라우팅, Steam/Custom 병합, Career 동적 렌더, marked.js 포스트
- `js/site-data.json` — 프로필·철학·UI 문구 (Career 카피 없음)
- `js/projects-data.js` — 프로젝트 카드/헤더 메타
- `js/careers-data.js` — Career 단일 소스 (`const careers` → `window.CAREERS`)
- `posts/{id}.md` — 상세 본문. 이미지는 `assets/img/projects/`
- `assets/career/` — 연혁 증빙 이미지 슬롯 (비어 있으면 `image: ""`)
- `steam-games.json` — Actions 자동 갱신, 수동 편집 금지
- `custom-games.json` — 콘솔/분석평/`blogUrl` (기존 코멘트·URL 보존)
- `scripts/fetch_steam.py` + `.github/workflows/update-steam.yml` — 매일 KST 자정 + 수동 dispatch. Secrets: `STEAM_API_KEY`, `STEAM_ID`
- `scripts/write_site_data.py` — `site-data.json` 재생성 (Career 배열 쓰지 않음)

## 프로필 링크
- mailto:zaqxsw0517b@gmail.com · github.com/agwabomb · blanktie.tistory.com · agwabomb.itch.io/gravita

## 제약
- React/Vue/번들러 도입 금지. 기획 용어(코어 루프, 상태 머신, Pacing, 튜토리얼라이제이션) 유지.
- 로컬 확인은 `python -m http.server 4173` (file:// 에서 JSON/MD fetch 실패).
