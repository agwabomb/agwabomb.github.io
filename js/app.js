const VIEWS = ["about", "projects", "games", "career"];
const HASH_ALIASES = { archive: "games", playlist: "games", contact: "about" };
const MIN_PLAYTIME_HOURS = 1;
const OFFICIAL_GENRES = ["액션", "슈팅", "RPG", "전략", "어드벤처", "퍼즐", "시뮬레이션", "생존", "카드", "공포", "리듬", "캐주얼"];
const GENRE_FILTERS = ["전체", ...OFFICIAL_GENRES];
const GENRE_ALIASES = {
  action: ["액션"],
  shooter: ["슈팅"],
  shooting: ["슈팅"],
  fps: ["슈팅"],
  tps: ["슈팅"],
  "extraction shooter": ["슈팅", "생존"],
  extraction: ["슈팅", "생존"],
  pvpve: ["슈팅"],
  rpg: ["RPG"],
  jrpg: ["RPG"],
  roguelike: ["RPG", "액션"],
  roguelite: ["RPG", "액션"],
  strategy: ["전략"],
  adventure: ["어드벤처"],
  puzzle: ["퍼즐"],
  simulation: ["시뮬레이션"],
  sim: ["시뮬레이션"],
  survival: ["생존"],
  card: ["카드"],
  "card game": ["카드"],
  "deck building": ["카드"],
  horror: ["공포"],
  rhythm: ["리듬"],
  music: ["리듬"],
  casual: ["캐주얼"],
  metroidvania: ["액션", "어드벤처"],
  platformer: ["액션"],
};
const FALLBACK_STEAM_GAMES = [
  { appId: 1808500, title: "ARC Raiders", playtimeHours: 217.55, playtimeMinutes: 13053, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1808500/header.jpg", platform: "Steam", genre: ["슈팅", "생존", "액션"] },
  { appId: 1245620, title: "ELDEN RING", playtimeHours: 178.84, playtimeMinutes: 10730, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", platform: "Steam", genre: ["RPG", "액션", "어드벤처"] },
  { appId: 1145360, title: "Hades", playtimeHours: 0, playtimeMinutes: 0, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg", platform: "Steam", genre: ["RPG", "액션"] },
];

const state = {
  site: { profile: { stacks: [], links: {} }, philosophy: [], career: [], ui: {}, fallbackCustomGames: [] },
  games: [],
  activeGenre: "전체",
  blogOnly: false,
  sourceLabel: "",
};

function ui(key) {
  return state.site.ui[key] || key;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (value) return [String(value)];
  return [];
}

function titleKey(title) {
  return String(title || "").trim().toLowerCase();
}

function appIdKey(game) {
  if (!game || game.appId === undefined || game.appId === null || game.appId === "") return null;
  const id = Number(game.appId);
  return Number.isFinite(id) ? id : null;
}

function parsePlaytimeHours(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = String(value || "").match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

function hoursFromGame(game) {
  if (!game) return 0;
  if (typeof game.playtimeHours === "number" && Number.isFinite(game.playtimeHours)) return game.playtimeHours;
  return parsePlaytimeHours(game.playtimeHours ?? game.playtime);
}

function formatPlaytime(hours) {
  const n = Number(hours) || 0;
  const shown = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  return `${shown}h`.replace(/\.0h$/, "h");
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function pickText(...values) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (text) return text;
  }
  return "";
}

function mapGenres(genres) {
  const mapped = [];
  const seen = new Set();
  asList(genres).forEach((raw) => {
    const token = String(raw).trim();
    if (!token) return;
    const officialHits = OFFICIAL_GENRES.includes(token) ? [token] : GENRE_ALIASES[token.toLowerCase()] || [];
    officialHits.forEach((genre) => {
      if (seen.has(genre)) return;
      seen.add(genre);
      mapped.push(genre);
    });
  });
  return mapped;
}

function findCustomIndex(customGames, steam, used) {
  const steamId = appIdKey(steam);
  const steamTitle = titleKey(steam.title);
  return customGames.findIndex((custom, index) => {
    if (used.has(index)) return false;
    const customId = appIdKey(custom);
    if (steamId != null && customId != null && steamId === customId) return true;
    return Boolean(steamTitle) && titleKey(custom.title) === steamTitle;
  });
}

function parseRoute() {
  const raw = (window.location.hash || "#about").replace(/^#/, "").trim();
  const [pageToken, projectId] = raw.split("/");
  const mapped = HASH_ALIASES[pageToken] || pageToken || "about";
  const view = VIEWS.includes(mapped) ? mapped : "about";
  return {
    view,
    projectId: view === "projects" && projectId ? projectId : null,
  };
}

function setHash(hash) {
  const next = hash.startsWith("#") ? hash : `#${hash}`;
  if (window.location.hash === next) {
    onRouteChange();
    return;
  }
  window.location.hash = next;
}

function mergeGameRecord(steam, custom) {
  const hours = Math.max(hoursFromGame(steam), hoursFromGame(custom));
  const steamGenres = mapGenres(steam && steam.genre);
  const customGenres = mapGenres(custom && custom.genre);
  return {
    appId: appIdKey(steam) ?? appIdKey(custom),
    title: (steam && steam.title) || (custom && custom.title) || "",
    image: pickText(steam && steam.image, custom && custom.image, custom && custom.customImage),
    playtimeHours: hours,
    playtimeLabel: formatPlaytime(hours),
    platforms: unique([steam && (steam.platform || "Steam"), custom && custom.platform]),
    genre: steamGenres.length ? steamGenres : customGenres,
    comment: pickText(custom && custom.comment, steam && steam.comment),
    blogUrl: pickText(custom && custom.blogUrl, steam && steam.blogUrl),
  };
}

function mergeLibraries(steamGames, customGames) {
  const usedCustom = new Set();
  const merged = [];

  steamGames.forEach((steam) => {
    const customIndex = findCustomIndex(customGames, steam, usedCustom);
    const custom = customIndex >= 0 ? customGames[customIndex] : null;
    if (customIndex >= 0) usedCustom.add(customIndex);
    merged.push(mergeGameRecord(steam, custom));
  });

  customGames.forEach((custom, index) => {
    if (usedCustom.has(index)) return;
    merged.push(mergeGameRecord(null, custom));
  });

  return merged
    .filter((game) => (game.playtimeHours || 0) >= MIN_PLAYTIME_HOURS)
    .sort((a, b) => (b.playtimeHours || 0) - (a.playtimeHours || 0));
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} ${response.status}`);
  const data = await response.json();
  return data;
}

function renderChrome() {
  const profile = state.site.profile;
  document.getElementById("stack-badges").innerHTML = (profile.stacks || [])
    .map((stack) => `<span class="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">${escapeHtml(stack)}</span>`)
    .join("");

  const actionClass = {
    email: "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
    github: "border border-slate-600 bg-slate-900 text-slate-100 hover:border-cyan-400/60",
    blog: "border border-indigo-500/40 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20",
    itch: "border border-sky-500/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20",
  };

  document.getElementById("hero-actions").innerHTML = Object.entries(profile.links || {})
    .map(([key, link]) => {
      const extra = String(link.href).startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : "";
      return `<a class="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${actionClass[key] || ""}" href="${escapeHtml(link.href)}" ${extra}>${escapeHtml(link.label)}</a>`;
    })
    .join("");

  document.getElementById("footer-links").innerHTML = Object.values(profile.links || {})
    .map((link) => {
      const extra = String(link.href).startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : "";
      return `<a class="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300" href="${escapeHtml(link.href)}" ${extra}>${escapeHtml(link.label)}</a>`;
    })
    .join("");

  document.getElementById("philosophy-grid").innerHTML = (state.site.philosophy || []).map((item) => `
    <article class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h3 class="font-display text-lg font-semibold text-cyan-200">${escapeHtml(item.title)}</h3>
      <p class="mt-2 text-sm leading-7 text-slate-400">${escapeHtml(item.body)}</p>
    </article>
  `).join("");

  renderCareerTimeline();
}

function careerItems() {
  if (Array.isArray(window.CAREERS) && window.CAREERS.length) return window.CAREERS;
  return state.site.career || [];
}

function normalizeCareer(item) {
  return {
    period: item.period || "",
    category: item.category || "",
    title: item.title || "",
    subtitle: item.subtitle || item.org || "",
    description: item.description || item.body || "",
    details: Array.isArray(item.details) ? item.details : [],
    image: item.image || "",
    imageAlt: item.imageAlt || item.title || "",
    links: Array.isArray(item.links) ? item.links.filter((link) => link && link.url && link.label) : [],
  };
}

function careerCategoryClass(category) {
  const key = String(category || "").toUpperCase();
  if (key.includes("PRACTICE")) return "border-sky-400/40 bg-sky-400/10 text-sky-200";
  if (key.includes("TRANSITION")) return "border-indigo-400/40 bg-indigo-500/10 text-indigo-200";
  if (key.includes("THESIS")) return "border-cyan-400/40 bg-cyan-400/10 text-cyan-200";
  if (key.includes("EDUCATION")) return "border-cyan-400/40 bg-cyan-400/10 text-cyan-200";
  if (key.includes("RESEARCH")) return "border-slate-600 bg-slate-800/80 text-slate-300";
  return "border-slate-600 bg-slate-800/80 text-slate-300";
}

function formatCareerPeriod(period) {
  const raw = String(period || "").trim();
  const parts = raw.split(/\s*~\s*/);
  if (parts.length === 2 && parts[0] && parts[1]) {
    return `${escapeHtml(parts[0])} <span class="font-medium text-slate-500">~</span><br>${escapeHtml(parts[1])}`;
  }
  if (parts.length === 2 && parts[0] && !parts[1]) {
    return `${escapeHtml(parts[0])} <span class="font-medium text-slate-500">~</span>`;
  }
  return escapeHtml(raw);
}

function periodDatetime(period) {
  const match = String(period || "").match(/(\d{4})\.(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : "";
}

function isHttpUrl(url) {
  return /^https?:\/\//i.test(String(url || ""));
}

function renderCareerTimeline() {
  const root = document.getElementById("career-timeline");
  const items = careerItems().map(normalizeCareer);
  if (!items.length) {
    root.innerHTML = `<li class="rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-sm text-slate-400">js/careers-data.js 에 이력을 추가해 주세요.</li>`;
    return;
  }

  root.innerHTML = items.map((item) => {
    const datetime = periodDatetime(item.period);
    const badge = item.category
      ? `<span class="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${careerCategoryClass(item.category)}">${escapeHtml(item.category)}</span>`
      : "";
    const subtitle = item.subtitle
      ? `<p class="mt-1 text-sm text-cyan-200/80">${escapeHtml(item.subtitle)}</p>`
      : "";
    const description = item.description
      ? `<p class="mt-3 text-sm leading-7 text-slate-300">${escapeHtml(item.description)}</p>`
      : "";
    const details = item.details.length
      ? `<ul class="mt-3 space-y-1.5 text-sm leading-6 text-slate-400">${item.details.map((detail) => `<li class="flex gap-2"><span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80"></span><span>${escapeHtml(detail)}</span></li>`).join("")}</ul>`
      : "";
    const media = item.image
      ? `<figure class="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}" class="h-44 w-full object-cover" onerror="this.closest('figure').remove()">
        </figure>`
      : "";
    const links = item.links.length
      ? `<div class="mt-4 flex flex-wrap gap-2">${item.links.map((link) => {
          const extra = isHttpUrl(link.url) ? 'target="_blank" rel="noopener noreferrer"' : "";
          return `<a class="inline-flex items-center rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-300" href="${escapeHtml(link.url)}" ${extra}>${escapeHtml(link.label)}</a>`;
        }).join("")}</div>`
      : "";

    return `
      <li class="career-item">
        <time class="career-period text-xl md:text-[1.35rem]" ${datetime ? `datetime="${datetime}"` : ""}>${formatCareerPeriod(item.period)}</time>
        <div class="career-rail" aria-hidden="true"><span class="career-node"></span></div>
        <article class="career-card rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 transition hover:border-cyan-400/30">
          ${badge}
          <h2 class="mt-3 font-display text-xl font-semibold text-slate-100">${escapeHtml(item.title)}</h2>
          ${subtitle}
          ${description}
          ${details}
          ${media}
          ${links}
        </article>
      </li>
    `;
  }).join("");
}

function projectVisual(kind) {
  if (kind === "gravity") {
    return `<div class="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950">
      <div class="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40"></div>
      <div class="absolute left-1/2 top-6 h-16 w-0.5 -translate-x-1/2 bg-cyan-300/80"></div>
      <div class="absolute bottom-6 left-1/2 h-16 w-0.5 -translate-x-1/2 bg-indigo-300/80"></div>
      <div class="absolute left-6 top-1/2 h-0.5 w-16 -translate-y-1/2 bg-sky-300/80"></div>
      <div class="absolute right-6 top-1/2 h-0.5 w-16 -translate-y-1/2 bg-blue-300/80"></div>
    </div>`;
  }
  return `<div class="absolute inset-0 bg-gradient-to-b from-sky-900 via-slate-800 to-slate-950">
    <div class="absolute -left-4 top-8 h-28 w-40 rounded-t-[80px] bg-slate-200/15"></div>
    <div class="absolute left-[28%] top-14 h-24 w-48 rounded-t-[60px] bg-slate-950/70"></div>
    <div class="absolute right-[8%] top-6 h-32 w-36 rounded-t-[70px] bg-slate-100/10"></div>
  </div>`;
}

function renderProjectGrid() {
  const projects = window.PROJECTS || [];
  document.getElementById("project-grid").innerHTML = projects.map((project) => {
    const cover = `<div class="relative h-48 overflow-hidden bg-slate-900">${projectVisual(project.visual)}
      ${project.cover ? `<img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}" class="absolute inset-0 h-full w-full object-cover" onerror="this.remove()">` : ""}
    </div>`;
    return `
      <article class="cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 transition hover:-translate-y-1 hover:border-cyan-400/30" data-open-project="${escapeHtml(project.id)}">
        ${cover}
        <div class="space-y-4 p-6">
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-200">${escapeHtml(project.engine)}</span>
            <span class="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300">${escapeHtml(project.platform)}</span>
            <span class="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300">${escapeHtml(ui("contribution"))} ${escapeHtml(project.contribution)}</span>
          </div>
          <h2 class="font-display text-2xl font-semibold">${escapeHtml(project.title)}</h2>
          <p class="text-sm text-slate-300">${escapeHtml(project.role)}</p>
          <div class="flex flex-wrap gap-2">${(project.tags || []).map((tag) => `<span class="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">${escapeHtml(tag)}</span>`).join("")}</div>
          <p class="text-sm leading-6 text-slate-400">${escapeHtml(project.summary)}</p>
          <a class="inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200" href="#projects/${escapeHtml(project.id)}">${escapeHtml(ui("viewPost"))}</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderProjectHeader(project) {
  const buttons = [
    `<button type="button" id="back-to-projects" class="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/50">${escapeHtml(ui("backToList"))}</button>`,
  ];
  if (project.links && project.links.itch) {
    buttons.push(`<a class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-300" href="${escapeHtml(project.links.itch)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ui("itchBuild"))}</a>`);
  }
  if (project.links && project.links.github) {
    buttons.push(`<a class="rounded-full border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:border-cyan-400/60" href="${escapeHtml(project.links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  }

  document.getElementById("project-detail-header").innerHTML = `
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">Project Post</p>
    <h1 class="mt-2 font-display text-3xl font-semibold sm:text-4xl">${escapeHtml(project.title)}</h1>
    <p class="mt-2 text-slate-400">${escapeHtml(project.subtitle || "")}</p>
    <dl class="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-3"><dt class="text-xs text-slate-500">${escapeHtml(ui("period"))}</dt><dd class="mt-1 text-slate-200">${escapeHtml(project.period)}</dd></div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-3"><dt class="text-xs text-slate-500">${escapeHtml(ui("engine"))}</dt><dd class="mt-1 text-slate-200">${escapeHtml(project.engine)}</dd></div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-3"><dt class="text-xs text-slate-500">${escapeHtml(ui("role"))}</dt><dd class="mt-1 text-slate-200">${escapeHtml(project.role)}</dd></div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-3"><dt class="text-xs text-slate-500">${escapeHtml(ui("contribution"))}</dt><dd class="mt-1 text-slate-200">${escapeHtml(project.contribution)}</dd></div>
    </dl>
    <div class="mt-6 flex flex-wrap gap-3">${buttons.join("")}</div>
  `;
  document.getElementById("back-to-projects").addEventListener("click", () => setHash("#projects"));
}

async function renderProjectPost(projectId) {
  const projects = window.PROJECTS || [];
  const project = projects.find((item) => item.id === projectId);
  const list = document.getElementById("projects-list");
  const detail = document.getElementById("project-detail");
  const body = document.getElementById("project-detail-body");

  if (!project) {
    history.replaceState(null, "", "#projects");
    showProjectList();
    return;
  }

  list.classList.add("hidden");
  detail.classList.remove("hidden");
  renderProjectHeader(project);
  body.innerHTML = `<p class="text-slate-500">${escapeHtml(ui("loadingPost"))}</p>`;

  try {
    const response = await fetch(project.post, { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    const markdown = await response.text();
    body.innerHTML = window.marked ? window.marked.parse(markdown) : `<pre>${escapeHtml(markdown)}</pre>`;
  } catch (error) {
    body.innerHTML = `<p class="rounded-2xl border border-dashed border-slate-700 p-6 text-slate-400">${escapeHtml(ui("mdError"))} <code>${escapeHtml(project.post)}</code></p>`;
    console.warn(error);
  }
}

function showProjectList() {
  document.getElementById("projects-list").classList.remove("hidden");
  document.getElementById("project-detail").classList.add("hidden");
}

function filteredGames() {
  return state.games.filter((game) => {
    const genreOk = state.activeGenre === "전체" || (game.genre || []).includes(state.activeGenre);
    const blogOk = !state.blogOnly || Boolean(game.blogUrl);
    return genreOk && blogOk;
  });
}

function renderGenreFilters() {
  document.getElementById("genre-filters").innerHTML = GENRE_FILTERS.map((genre) => {
    const active = genre === state.activeGenre;
    return `<button type="button" data-genre="${escapeHtml(genre)}" class="rounded-full px-3 py-1.5 text-xs transition ${active ? "bg-cyan-400 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/50"}">${escapeHtml(genre)}</button>`;
  }).join("");
}

function renderGames() {
  const games = filteredGames();
  const grid = document.getElementById("game-grid");
  const empty = document.getElementById("game-empty");
  document.getElementById("archive-status").textContent = `${state.sourceLabel} · 1시간 이상 ${state.games.length} · 표시 ${games.length}`;

  if (!games.length) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  const fallback = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 215"><rect fill="#0f172a" width="460" height="215"/></svg>');
  grid.innerHTML = games.map((game) => {
    const comment = game.comment
      ? `<blockquote class="mt-4 rounded-2xl border-l-2 border-cyan-400/70 bg-slate-800/70 px-3 py-2 text-sm leading-6 text-slate-300">“${escapeHtml(game.comment)}”</blockquote>`
      : "";
    const blog = game.blogUrl
      ? `<a class="mt-4 inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200" href="${escapeHtml(game.blogUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ui("openAnalysis"))}</a>`
      : "";
    const platforms = (game.platforms || []).map((platform) => `<span class="rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">${escapeHtml(platform)}</span>`).join("");
    return `
      <article class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 transition hover:-translate-y-1 hover:border-cyan-400/30">
        <div class="relative aspect-[460/215] overflow-hidden bg-slate-800">
          <img src="${escapeHtml(game.image || fallback)}" alt="${escapeHtml(game.title)}" class="h-full w-full object-cover" onerror="this.onerror=null;this.src='${fallback}'" />
        </div>
        <div class="p-4 sm:p-5">
          <h2 class="font-display text-lg font-semibold leading-snug">${escapeHtml(game.title)}</h2>
          <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>${escapeHtml(game.playtimeLabel)}</span>
            ${platforms}
          </div>
          ${comment}
          ${blog}
        </div>
      </article>
    `;
  }).join("");
}

function updateNav(view) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === view);
  });
}

async function onRouteChange() {
  const route = parseRoute();
  const canonical = `#${route.view}${route.projectId ? `/${route.projectId}` : ""}`;
  if ((window.location.hash || "#") !== canonical) {
    history.replaceState(null, "", canonical);
  }

  document.querySelectorAll("[data-view]").forEach((section) => {
    section.classList.toggle("hidden", section.dataset.view !== route.view);
  });
  updateNav(route.view);
  closeMobileNav();

  if (route.view === "projects" && route.projectId) {
    await renderProjectPost(route.projectId);
  } else if (route.view === "projects") {
    showProjectList();
  }

  window.scrollTo(0, 0);
}

function closeMobileNav() {
  const panel = document.getElementById("mobile-nav");
  const toggle = document.getElementById("menu-toggle");
  panel.classList.add("hidden");
  toggle.setAttribute("aria-expanded", "false");
}

function bindEvents() {
  document.getElementById("menu-toggle").addEventListener("click", () => {
    const panel = document.getElementById("mobile-nav");
    const open = panel.classList.toggle("hidden") === false;
    document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
  });

  document.getElementById("project-grid").addEventListener("click", (event) => {
    if (event.target.closest("a[href^='#projects/']")) return;
    const card = event.target.closest("[data-open-project]");
    if (!card) return;
    event.preventDefault();
    setHash(`#projects/${card.dataset.openProject}`);
  });

  document.getElementById("genre-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-genre]");
    if (!button) return;
    state.activeGenre = button.dataset.genre;
    renderGenreFilters();
    renderGames();
  });

  document.getElementById("blog-only-toggle").addEventListener("change", (event) => {
    state.blogOnly = event.target.checked;
    renderGames();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const route = parseRoute();
    if (route.projectId) setHash("#projects");
  });

  window.addEventListener("hashchange", onRouteChange);
}

async function initGames() {
  const [steamResult, customResult] = await Promise.all([
    loadJson("steam_games.json").catch((error) => {
      console.warn("steam_games.json fallback", error);
      return null;
    }),
    loadJson("custom_games.json").catch((error) => {
      console.warn("custom_games.json fallback", error);
      return null;
    }),
  ]);
  const steamGames = Array.isArray(steamResult) ? steamResult : FALLBACK_STEAM_GAMES;
  const customGames = Array.isArray(customResult) ? customResult : state.site.fallbackCustomGames || [];
  state.games = mergeLibraries(steamGames, customGames);
  state.sourceLabel = !Array.isArray(steamResult) || !Array.isArray(customResult) ? ui("fallbackData") : ui("mergedData");
  renderGenreFilters();
  renderGames();
}

async function boot() {
  try {
    state.site = await loadJson("js/site-data.json");
  } catch (error) {
    console.warn("site-data.json fallback", error);
  }
  state.activeGenre = "전체";
  if (window.marked && window.marked.setOptions) {
    window.marked.setOptions({ gfm: true, breaks: true });
  }
  document.getElementById("year").textContent = String(new Date().getFullYear());
  renderChrome();
  renderProjectGrid();
  bindEvents();
  await initGames();
  onRouteChange();
}

boot();
