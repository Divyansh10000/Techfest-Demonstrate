/* Techfest 2026 — event discovery: search + category, pathway and day filters. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const $ = (s, r = document) => r.querySelector(s);
  const grid = $("#eventGrid");
  if (!grid || !U) return;

  const catChips = $("#catChips");
  const pathChips = $("#pathChips");
  const dayChips = $("#dayChips");
  const count = $("#resultCount");
  const input = $("#eventSearch");
  const params = new URLSearchParams(location.search);

  const state = {
    cat: params.get("cat") || "all",
    path: params.get("path") || "all",
    day: params.get("day") || "all",
    q: (params.get("q") || "").trim()
  };
  if (!(T.categories || []).some((c) => c.id === state.cat)) state.cat = "all";
  if (!(T.pathways || []).some((p) => p.id === state.path)) state.path = "all";
  if (!["all", "1", "2", "3"].includes(state.day)) state.day = "all";
  if (input) input.value = state.q;

  /* schedule index: eventId -> [day numbers] */
  const evDay = {};
  (T.schedule || []).forEach((d, i) => (d.blocks || []).forEach((b) => {
    if (b.eventId) (evDay[b.eventId] = evDay[b.eventId] || []).push(i + 1);
  }));

  const chip = (label, on, attrs) => `<button class="chip${on ? " is-on" : ""}" type="button" ${attrs} aria-pressed="${on}">${U.esc(label)}</button>`;

  if (catChips) catChips.innerHTML = (T.categories || []).map((c) => chip(c.name, c.id === state.cat, `data-cat="${U.esc(c.id)}"`)).join("");
  if (pathChips) pathChips.innerHTML =
    chip("All pathways", state.path === "all", 'data-path="all"') +
    (T.pathways || []).map((p) => chip(p.name, p.id === state.path, `data-path="${U.esc(p.id)}"`)).join("");
  if (dayChips) dayChips.innerHTML =
    chip("All days", state.day === "all", 'data-day="all"') +
    (T.schedule || []).map((d, i) => chip(`${d.day} · ${d.date}`, String(i + 1) === state.day, `data-day="${i + 1}"`)).join("");

  function wireGroup(wrap, key, attr) {
    if (!wrap) return;
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest(`[${attr}]`);
      if (!b) return;
      state[key] = b.getAttribute(attr);
      wrap.querySelectorAll(`[${attr}]`).forEach((x) => { const on = x.getAttribute(attr) === state[key]; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
      render();
    });
  }
  wireGroup(catChips, "cat", "data-cat");
  wireGroup(pathChips, "path", "data-path");
  wireGroup(dayChips, "day", "data-day");

  if (input) input.addEventListener("input", () => { state.q = input.value.trim(); render(); });

  function render() {
    const needle = state.q.toLowerCase();
    const list = (T.events || []).filter((e) => {
      if (state.cat !== "all" && e.category !== state.cat) return false;
      if (state.path !== "all" && !(e.pathways || []).includes(state.path)) return false;
      if (state.day !== "all" && !(evDay[e.id] || []).includes(Number(state.day))) return false;
      if (!needle) return true;
      const hay = [e.title, e.blurb, e.tagline, e.venue, U.catName(e.category), (e.pathways || []).join(" ")].join(" ").toLowerCase();
      return hay.includes(needle);
    });

    grid.innerHTML = list.length
      ? list.map((e) => U.eventCard(e)).join("")
      : `<div class="empty" style="grid-column:1/-1">Nothing matches these filters.
           <p style="margin-top:14px"><button class="btn btn-sm btn-gold" id="clearFilters" type="button">Clear all filters</button></p>
         </div>`;
    if (T.genome && T.genome.scan) T.genome.scan(grid);

    if (count) {
      const bits = [state.cat !== "all" ? U.catName(state.cat) : "", state.path !== "all" ? (T.pathways.find((p) => p.id === state.path) || {}).name : "", state.day !== "all" ? "Day " + state.day : ""].filter(Boolean);
      count.textContent = `${list.length} ${list.length === 1 ? "event" : "events"}${bits.length ? " · " + bits.join(" · ") : ""}`;
    }

    const clear = $("#clearFilters");
    if (clear) clear.addEventListener("click", () => {
      state.cat = state.path = state.day = "all"; state.q = "";
      if (input) input.value = "";
      document.querySelectorAll("#catChips [data-cat], #pathChips [data-path], #dayChips [data-day]").forEach((x) => {
        const key = x.hasAttribute("data-cat") ? "cat" : x.hasAttribute("data-path") ? "path" : "day";
        const val = x.getAttribute("data-" + key);
        const on = val === "all";
        x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on));
      });
      render();
    });
  }

  render();
})();
