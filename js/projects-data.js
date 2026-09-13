/**
 * 프로젝트 카드/상세 헤더 메타데이터.
 * 본문(줄글·사진·GIF)은 posts/{id}.md 에서 관리합니다.
 * 새 프로젝트를 추가할 때: 이 배열에 객체를 넣고, posts/{id}.md 를 만들면 됩니다.
 */
window.PROJECTS = [
  {
    id: "snowball",
    title: "Snowball Battleground",
    subtitle: "가제",
    period: "2025 — 진행 중",
    engine: "Unreal Engine",
    platform: "PC",
    role: "전장 레벨 기획 및 Landscape 지형 조형",
    contribution: "100%",
    tags: ["레벨 디자인", "Landscape", "교전 동선", "긴 TTK"],
    summary:
      "느린 곡사 투사체와 높은 TTK가 전제를 바꿉니다. 한 방에 끝나지 않는 교전을 위해, 개방형 실외 전장에 다시 붙을 수 있는 순환 동선을 심었습니다.",
    cover: "assets/img/projects/snowball-cover.svg",
    visual: "snow",
    post: "posts/snowball.md",
    links: {
      itch: "",
      github: "",
    },
  },
  {
    id: "gravita",
    title: "Gravita",
    subtitle: "Gravity Reversal",
    period: "2025 — 프로토타입",
    engine: "Unity 2D WebGL",
    platform: "WebGL",
    role: "1인 시스템 룰 및 레벨 기획, Unity 2D WebGL 프로토타이핑",
    contribution: "100%",
    tags: ["시스템 룰", "상태 머신", "비언어적 튜토리얼", "보스 밸런싱"],
    summary:
      "중력을 네 방향으로 뒤집는 코어 상태 머신을 먼저 정의하고, 텍스트 없이 공간만으로 규칙을 가르친 뒤, 안전 습관을 의도적으로 배신하는 난이도 곡선을 설계했습니다.",
    cover: "assets/img/projects/gravita-cover.svg",
    visual: "gravity",
    post: "posts/gravita.md",
    links: {
      itch: "https://agwabomb.itch.io/gravita",
      github: "",
    },
  },
];
