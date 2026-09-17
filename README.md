# agwabomb.github.io

게임 시스템 & 레벨 기획자 포트폴리오. GitHub Pages에서 빌드 없이 호스팅되는 정적 사이트입니다.

해시 라우팅으로 네 개의 화면을 전환합니다: `#about` · `#projects` · `#games` · `#career`. 프로젝트 상세는 `#projects/{id}` 입니다.

## 구성

- `index.html` — Tailwind CDN 마크업과 뷰 컨테이너
- `js/app.js` — 해시 라우팅, Steam/커스텀 게임 병합, 화면 렌더
- `js/site-data.json` — About 카피와 UI 문구
- `js/projects-data.js` — 프로젝트 카드/헤더 메타데이터
- `js/careers-data.js` — Career 세로 타임라인 이력 (`const careers = [...]`)
- `posts/{id}.md` — 상세 기획 포스트 본문 (사진·GIF·문단은 여기만 수정)
- `steam-games.json` — GitHub Actions가 갱신. **수동 편집하지 마세요.**
- `custom-games.json` — 콘솔 타이틀, 기획 한 줄 평, 블로그 링크
- `scripts/fetch_steam.py` / `.github/workflows/update-steam.yml` — Steam 일일 동기화

## 프로젝트 포스트 추가

1. `js/projects-data.js`에 `id`, 제목, 기간, 엔진, 역할, 커버 경로, `post` 경로를 넣습니다.
2. `posts/{id}.md`에 마크다운 본문을 작성합니다. 이미지는 `assets/img/projects/` 에 두고 `![설명](assets/img/projects/파일.gif)` 또는 `<figure>`로 넣습니다.

## Career 타임라인 추가

`js/careers-data.js`의 `careers` 배열에 객체를 넣습니다. **위가 과거, 아래가 최근**입니다. 이미지는 `assets/career/`에 두고 `image` 경로만 채우면 카드에 썸네일이 붙습니다. 링크가 없으면 `links: []`, 이미지가 없으면 `image: ""` 로 두면 슬롯이 렌더되지 않습니다.

## 게임 데이터 병합

`Promise.all`로 두 JSON을 가져온 뒤 타이틀(및 선택적 `appId`) 기준으로 병합합니다. Steam 썸네일·플레이타임 위에 `comment` / `genre` / `blogUrl`을 덮습니다. fetch가 막히면 폴백 배열을 사용합니다.

## Steam 자동 갱신

Settings → Secrets에 `STEAM_API_KEY`, `STEAM_ID`를 등록한 뒤 Actions에서 **Update Steam Games**를 실행합니다.

## 로컬 확인

```bash
python -m http.server 4173
```

마크다운 포스트는 `file://`가 아니라 로컬 서버에서 열어야 불러집니다.
