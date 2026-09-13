# agwabomb.github.io

게임 시스템 & 레벨 기획자 포트폴리오. GitHub Pages에서 빌드 없이 호스팅되는 1페이지 정적 사이트입니다.

방대한 데이터 속 오차를 줄여가던 연구자적 사고로 도파민 공식을 설계하는 게임 기획자.

## 구성

- `index.html` — Tailwind CDN 기반 반응형 페이지. `PROFILE`, `projects`, `career` 객체와 Steam/커스텀 게임 병합 렌더러가 포함되어 있습니다.
- `steam-games.json` — GitHub Actions가 Steam Web API로 갱신하는 원본 라이브러리. **수동 편집하지 마세요.**
- `custom-games.json` — 콘솔/스위치 타이틀, 기획 한 줄 평, 역기획 블로그 링크를 직접 관리합니다.
- `scripts/fetch_steam.py` — 플레이타임 60분 이상 게임을 수집해 `steam-games.json`으로 저장합니다.
- `.github/workflows/update-steam.yml` — 매일 자정(KST) 및 수동 실행.

## 게임 데이터 병합

프론트엔드는 `Promise.all`로 두 JSON을 가져온 뒤 타이틀(및 선택적 `appId`) 기준으로 병합합니다.

- Steam 쪽 썸네일·플레이타임을 유지하고, 커스텀 쪽 `comment` / `genre` / `blogUrl`을 덮어씁니다.
- Steam에 없는 콘솔 게임은 카드 그리드에 그대로 추가됩니다.
- `file://`처럼 fetch가 막히면 `index.html` 안의 폴백 배열로 렌더링합니다.

`custom-games.json` 필드: `title`, `platform`, `customImage`, `playtime`, `genre`, `comment`, `blogUrl`.

## Steam 자동 갱신 설정

저장소 Settings → Secrets and variables → Actions에 다음을 등록합니다.

- `STEAM_API_KEY` — [Steam Web API Key](https://steamcommunity.com/dev/apikey)
- `STEAM_ID` — 64비트 SteamID

프로필의 게임 세부 정보는 공개여야 API가 라이브러리를 반환합니다. 워크플로우 탭에서 **Update Steam Games**를 수동 실행해 첫 동기화를 확인할 수 있습니다.

## 로컬 확인

```bash
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다.
