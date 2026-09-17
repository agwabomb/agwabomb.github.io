/**
 * Career 세로 타임라인 데이터.
 * 순서: 위가 과거, 아래가 최근(연혁). 배열 순서가 곧 화면 순서입니다.
 * 이미지: assets/career/ 또는 assets/img/projects/
 *
 * 스키마:
 * {
 *   period: "YYYY.MM" | "YYYY.MM ~ YYYY.MM" | "YYYY.MM ~",
 *   category: "RESEARCH" | "EDUCATION / THESIS" | "TRANSITION" | "PRACTICE",
 *   title, subtitle, description,
 *   details: string[],
 *   image: "",  // 예: "assets/career/thesis.jpg"
 *   links: [{ label, url }]
 * }
 */
const careers = [
  {
    period: "2022.03 ~ 2025.08",
    category: "RESEARCH",
    title: "관측·시뮬레이션 데이터의 오차 통제",
    subtitle: "연세대학교 천문우주학과 석사과정 · CASCADE",
    description:
      "학부에서 익힌 측정 습관을 석사 연구에서 닫았습니다. 신호와 노이즈를 가르고, 조건을 고정한 뒤 남는 오차를 설명하는 훈련이, 지금의 밸런싱 시트와 같은 문법입니다.",
    details: [
      "가설·통제 변수·검증 절차를 문서로 남기는 재현 가능한 실험 설계",
      "SPHINX20 시뮬레이션 기반 JWST/NIRCam 측광에서 방출선·먼지·SFH 가정이 질량·SFR 추정에 주는 편향을 정량화",
    ],
    image: "",
    links: [],
  },
  {
    period: "2025.08",
    category: "EDUCATION / THESIS",
    title: "연세대학교 대학원 천문우주학과 석사 졸업",
    subtitle: "SCIE 논문 게재 및 통제 변수 실험 설계",
    description:
      "시뮬레이션 데이터 오차 통제 및 재현 가능한 가설 검증 훈련. 기획서의 수치 테이블 및 밸런싱 시트로 이어지는 연구자적 사고 체득.",
    details: [
      "Astronomy & Astrophysics(A&A) 주저자 논문 게재 (SCIE, 2026.02 온라인 출판)",
      "영국 옥스포드 대학교(University of Oxford) 단기 파견 및 글로벌 공동 연구",
    ],
    image: "",
    links: [
      { label: "논문 보기", url: "https://doi.org/10.1051/0004-6361/202557054" },
      { label: "arXiv", url: "https://arxiv.org/abs/2510.00400" },
    ],
  },
  {
    period: "2025.10 ~",
    category: "TRANSITION",
    title: "연구 노트를 레벨에 옮기다",
    subtitle: "그레이박스 프로토타이핑 및 역기획 블로그",
    description:
      "지형 스케일, 엄폐 간격, 중력 전이 딜레이처럼 손맛으로 보이던 값을 먼저 그레이박스로 고정합니다. 아트보다 동선과 실패 피드백을 먼저 닫고, 코어 루프를 기획 용어로 분해합니다.",
    details: [
      "가설을 수치로 적고 플레이테스트로 오차를 줄이는 검증 루프",
      "추출·메트로바니아 등 장르 규칙을 튜토리얼라이제이션과 페이싱 관점으로 해체하는 역기획 아카이브",
    ],
    image: "",
    links: [{ label: "역기획 블로그", url: "https://blanktie.tistory.com" }],
  },
  {
    period: "2025.10 ~",
    category: "PRACTICE",
    title: "시스템 룰 × 레벨 동선 프로토타이핑",
    subtitle: "Snowball Battleground & Gravita",
    description:
      "캐주얼 슈팅 전장에서는 레벨이 교전 빈도를 설계하고, Gravita에서는 상태 머신이 공간을 다시 읽게 만들었습니다.",
    details: [
      "Snowball Battleground: 곡사 투사체와 긴 TTK에 맞춘 교전 순환 동선, Landscape 전장 조형",
      "Gravita: 4방향 중력 반전 상태 머신, 5단계 비언어적 튜토리얼, 2페이즈 안전지대 해체 난이도 곡선",
    ],
    image: "assets/img/projects/gravita-cover.svg",
    links: [
      { label: "Gravita 기획서", url: "#projects/gravita" },
      { label: "Snowball 기획서", url: "#projects/snowball" },
      { label: "itch.io 빌드", url: "https://agwabomb.itch.io/gravita" },
    ],
  },
];

window.CAREERS = careers;
