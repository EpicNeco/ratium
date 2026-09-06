/* ===== WBAO Data ===== */
const bootstrappers = [
  { name: "Bloxstrap",         platform: "windows", icon: "🪟", platformName: "Windows", status: "online",   version: "2.8.2",  uptime: "99.9%", lastUpdate: "3h ago" },
  { name: "RBX-Bootstrap",     platform: "windows", icon: "🪟", platformName: "Windows", status: "online",   version: "2.4.1",  uptime: "99.8%", lastUpdate: "2h ago" },
  { name: "GrizzleLoader",     platform: "windows", icon: "🪟", platformName: "Windows", status: "updating", version: "1.9.0",  uptime: "97.2%", lastUpdate: "6h ago" },
  { name: "Sober",             platform: "linux",   icon: "🐧", platformName: "Linux",   status: "online",   version: "0.12.3", uptime: "99.1%", lastUpdate: "1d ago" },
  { name: "Vinegar",           platform: "linux",   icon: "🐧", platformName: "Linux",   status: "updating", version: "0.11.8", uptime: "94.5%", lastUpdate: "4h ago" },
  { name: "MacBstrap",         platform: "mac",     icon: "🍎", platformName: "macOS",   status: "online",   version: "0.9.5",  uptime: "96.3%", lastUpdate: "5h ago" },
  { name: "BootstrapperX",     platform: "mac",     icon: "🍎", platformName: "macOS",   status: "patched",  version: "1.2.0",  uptime: "81.0%", lastUpdate: "12h ago" },
  { name: "RobloxUWP-Boot",    platform: "android", icon: "🤖", platformName: "Android", status: "online",   version: "3.0.1",  uptime: "98.7%", lastUpdate: "1h ago" },
  { name: "DroidBoot",         platform: "android", icon: "🤖", platformName: "Android", status: "online",   version: "1.4.7",  uptime: "95.8%", lastUpdate: "8h ago" },
  { name: "iOSBoot",           platform: "ios",     icon: "📱", platformName: "iOS",     status: "patched",  version: "0.7.2",  uptime: "72.4%", lastUpdate: "2d ago" },
  { name: "WebBstrap",         platform: "web",     icon: "🌐", platformName: "Web",     status: "online",   version: "1.1.0",  uptime: "99.5%", lastUpdate: "10h ago" },
];

/* ===== Status metadata ===== */
const statusMeta = {
  online:   { label: "Online",   cls: "online",   dot: "ok" },
  patched:  { label: "Patched",  cls: "patched",  dot: "down" },
  updating: { label: "Updating", cls: "updating", dot: "warn" },
};

/* ===== State ===== */
let currentFilter = "all";
let currentSearch = "";

/* ===== Elements ===== */
const grid = document.getElementById("statusGrid");
const emptyState = document.getElementById("emptyState");
const globalStatus = document.getElementById("globalStatus");
const bannerStats = document.getElementById("bannerStats");
const searchBox = document.getElementById("searchBox");
const lastUpdated = document.getElementById("lastUpdated");
const countdown = document.getElementById("countdown");
const themeToggle = document.getElementById("themeToggle");

/* ===== Generate fake 30-day uptime history ===== */
bootstrappers.forEach((b) => {
  b.days = Array.from({ length: 30 }, () => {
    const r = Math.random();
    return r > 0.92 ? "fail" : r > 0.85 ? "warn" : "ok";
  });
});

/* ===== Render cards ===== */
function render() {
  const list = bootstrappers.filter((b) => {
    const matchFilter = currentFilter === "all" || b.platform === currentFilter;
    const matchSearch =
      b.name.toLowerCase().includes(currentSearch) ||
      b.platformName.toLowerCase().includes(currentSearch);
    return matchFilter && matchSearch;
  });

  grid.innerHTML = list
    .map((b) => {
      const s = statusMeta[b.status];
      return `
      <div class="card">
        <div class="card-head">
          <div class="card-title">
            <span class="platform-icon">b.icon</span>{b.icon}</span>b.icon</span>{b.name}
          </div>
          <span class="badge s.cls">{s.cls}">s.cls">{s.label}</span>
        </div>
        <div class="card-meta">
          <div>Platform: <strong>${b.platformName}</strong></div>
          <div>Version: <strong>${b.version}</strong></div>
          <div>Uptime: <strong>${b.uptime}</strong></div>
          <div>Last update: <strong>${b.lastUpdate}</strong></div>
        </div>
        <div class="uptime-bar">
          {b.days.map((d) => `<i class="{d === "ok" ? "" : d}"></i>`).join("")}
        </div>
      </div>`;
    })
    .join("");

  emptyState.classList.toggle("hidden", list.length > 0);
  updateGlobalStatus(list);
  updateStats(list);
}

/* ===== Global status banner ===== */
function updateGlobalStatus(list) {
  const anyPatched = list.some((b) => b.status === "patched");
  const anyUpdating = list.some((b) => b.status === "updating");

  if (anyPatched) {
    globalStatus.innerHTML = `<span class="dot down pulse"></span> Some bootstrappers are patched`;
    globalStatus.className = "global-status status-down";
  } else if (anyUpdating) {
    globalStatus.innerHTML = `<span class="dot warn pulse"></span> Some bootstrappers are updating`;
    globalStatus.className = "global-status status-issues";
  } else {
    globalStatus.innerHTML = `<span class="dot ok"></span> All systems operational`;
    globalStatus.className = "global-status status-ok";
  }
}

/* ===== Quick stats chips ===== */
function updateStats(list) {
  const online = list.filter((b) => b.status === "online").length;
  const patched = list.filter((b) => b.status === "patched").length;
  const updating = list.filter((b) => b.status === "updating").length;

  bannerStats.innerHTML = `
    <div class="stat-chip">✅ Online: <strong>${online}</strong></div>
    <div class="stat-chip">🔄 Updating: <strong>${updating}</strong></div>
    <div class="stat-chip">❌ Patched: <strong>${patched}</strong></div>
  `;
}

/* ===== Filter buttons ===== */
document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  render();
});

/* ===== Live search ===== */
searchBox.addEventListener("input", (e) => {
  currentSearch = e.target.value.toLowerCase().trim();
  render();
});

/* ===== Theme toggle (saved to localStorage) ===== */
if (localStorage.getItem("wbao-theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("wbao-theme", isLight ? "light" : "dark");
});

/* ===== Auto-refresh with countdown ===== */
let secondsLeft = 60;

setInterval(() => {
  secondsLeft--;
  countdown.textContent = secondsLeft;
  if (secondsLeft <= 0) {
    secondsLeft = 60;
    lastUpdated.textContent = "just now";
    // re-randomize uptime bars on refresh
    bootstrappers.forEach((b) => {
      b.days = b.days.map(() => {
        const r = Math.random();
        return r > 0.94 ? "fail" : r > 0.87 ? "warn" : "ok";
      });
    });
    render();
  } else {
    lastUpdated.textContent = `${secondsLeft}s ago`;
  }
}, 1000);

/* ===== Initial render ===== */
render();
