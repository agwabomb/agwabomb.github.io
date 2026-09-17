# 현재 스냅샷

게임 시스템 & 레벨 기획자 GitHub Pages 포트폴리오. 빌드 없는 정적 HTML/JS + Tailwind CDN. 다크 모드(Slate 900/950, Cyan/Indigo 포인트).

## 라우팅
- 해시 SPA: `#about` · `#projects` · `#games` · `#career` (기본 `#about`)
- 프로젝트 상세: `#projects/{id}` (목록으로 복귀는 `#projects`)
- 별칭: `#archive`/`#playlist` → games, `#contact` → about
- 뷰 전환 시 `scrollTo(0,0)`, 활성 GNB 시안 인디케이터, 모바일 햄버거

## 뷰
- **About:** USP, 학력(연세대 천문우주 학·석사), 스택 뱃지, Contact/GitHub/블로그/itch.io, 철학 4장(교전 순환 동선 · 상태 머신 · 난이도 곡선 · 가설 검증형 밸런싱)
- **Projects:** 카드 그리드 → 마크다운 상세 포스트. Snowball Battleground(UE Landscape, 곡사/긴 TTK 교전 루프), Gravita(Unity 2D WebGL, 4방향 중력 상태 머신, itch.io)
- **Playlist:** Steam+Custom 병합 카드, 장르 필터, 분석글 토글
- **Career:** Research → Thesis → Transition → Practice 카드

## 파일
- `index.html` — 마크업/뷰 컨테이너
- `js/app.js` — 라우팅, 병합 렌더, marked.js 포스트
- `js/site-data.json` — 프로필·철학·커리어·UI 문구 (카피 수정은 여기)
- `js/projects-data.js` — 프로젝트 카드/헤더 메타
- `posts/{id}.md` — 상세 본문. 이미지는 `assets/img/projects/`
- `steam-games.json` — Actions 자동 갱신, 수동 편집 금지
- `custom-games.json` — 콘솔/분석평/blogUrl
- `scripts/fetch_steam.py` + `.github/workflows/update-steam.yml` — 매일 KST 자정 + 수동 dispatch. Secrets: `STEAM_API_KEY`, `STEAM_ID`

## 프로필 링크
- mailto:zaqxsw0517b@gmail.com · github.com/agwabomb · blanktie.tistory.com · agwabomb.itch.io

## 제약
- React/Vue/번들러 도입 금지. 기획 용어(코어 루프, 상태 머신, Pacing, 튜토리얼라이제이션) 유지.
- 로컬 확인은 `python -m http.server` (file:// 에서 JSON/MD fetch 실패).
