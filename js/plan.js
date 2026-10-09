/* Techfest 2026 — "Build Your Techfest" planner. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const $ = (s) => document.querySelector(s);
  if (!U) return;

  const interestWrap = $("#interestChips");
  const pathWrap = $("#pathChips");
  const dayWrap = $("#dayChips");
  const out = $("#routeOutput");
  const summary = $("#routeSummary");
  const note = $("#plannerNote");
  const build = $("#buildRoute");
  if (!interestWrap || !out) return;

  const state = { interests: new Set(), pathway: "", days: new Set() };

  /* restore */
  try {
    const saved = JSON.parse(localStorage.getItem("tf-plan") || "{}");
    (saved.interests || []).forEach((i) => state.interests.add(i));
    (saved.days || []).forEach((d) => state.days.add(d));
    state.pathway = saved.pathway || "";
  } catch (e) { /* ignore */ }

  const days = ["1", "2", "3"];

  interestWrap.innerHTML = (T.interests || []).map((i) =>
    `<button class="chip interest-chip${state.interests.has(i.id) ? " is-on" : ""}" type="button" data-id="${U.esc(i.id)}" aria-pressed="${state.interests.has(i.id)}">${U.esc(i.label)}</button>`
  ).join("");

  pathWrap.innerHTML = (T.pathways || []).map((p) =>
    `<button class="chip interest-chip${state.pathway === p.id ? " is-on" : ""}" type="button" data-path="${U.esc(p.id)}" aria-pressed="${state.pathway === p.id}">${U.esc(p.name)}</button>`
  ).join("");

  dayWrap.innerHTML = (T.schedule || []).map((d, i) =>
    `<button class="chip interest-chip${state.days.has(String(i + 1)) ? " is-on" : ""}" type="button" data-day="${i + 1}" aria-pressed="${state.days.has(String(i + 1))}">${U.esc(d.day)} · ${U.esc(d.date)}</button>`
  ).join("");

  const persist = () => { try { localStorage.setItem("tf-plan", JSON.stringify({ interests: [...state.interests], days: [...state.days], pathway: state.pathway })); } catch (e) { /* ignore */ } };

  interestWrap.addEventListener("click", (e) => {
    const b = e.target.closest("[data-id]"); if (!b) return;
    const id = b.dataset.id;
    if (state.interests.has(id)) state.interests.delete(id); else state.interests.add(id);
    b.classList.toggle("is-on"); b.setAttribute("aria-pressed", String(state.interests.has(id)));
    persist();
  });
  pathWrap.addEventListener("click", (e) => {
    const b = e.target.closest("[data-path]"); if (!b) return;
    state.pathway = state.pathway === b.dataset.path ? "" : b.dataset.path;
    pathWrap.querySelectorAll("[data-path]").forEach((x) => { const on = x.dataset.path === state.pathway; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
    persist();
  });
  dayWrap.addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]"); if (!b) return;
    const d = b.dataset.day;
    if (state.days.has(d)) state.days.delete(d); else state.days.add(d);
    b.classList.toggle("is-on"); b.setAttribute("aria-pressed", String(state.days.has(d)));
    persist();
  });

  /* schedule index: eventId -> [{day, time}] */
  const dayOf = {};
  (T.schedule || []).forEach((d, i) => {
    (d.blocks || []).forEach((bl) => {
      if (!bl.eventId) return;
      (dayOf[bl.eventId] = dayOf[bl.eventId] || []).push({ day: i + 1, time: bl.time, venue: bl.venue });
    });
  });

  function buildRoute() {
    const interestEvents = new Set();
    state.interests.forEach((id) => {
      const it = (T.interests || []).find((x) => x.id === id);
      if (it) it.events.forEach((e) => interestEvents.add(e));
    });
    const pw = (T.pathways || []).find((p) => p.id === state.pathway);

    const list = (T.events || []).filter((e) => {
      if (state.interests.size && !interestEvents.has(e.id)) return false;
      if (pw && !(pw.match || []).includes(e.category)) return false;
      if (state.days.size) {
        const ds = (dayOf[e.id] || []).map((x) => String(x.day));
        if (!ds.some((d) => state.days.has(d))) return false;
      }
      return true;
    });

    if (!list.length) {
      summary.innerHTML = "";
      out.innerHTML = `<p class="sub">No events match that exact combination. Try adding an interest or clearing a day.</p>`;
      return;
    }

    const rows = [];
    list.forEach((e) => {
      const slots = dayOf[e.id] || [{ day: 0, time: "All day", venue: e.venue }];
      slots.forEach((s) => rows.push({ e, s }));
    });
    rows.sort((a, b) => (a.s.day - b.s.day) || a.s.time.localeCompare(b.s.time));

    const groups = {};
    rows.forEach((r) => { (groups[r.s.day] = groups[r.s.day] || []).push(r); });

    const html = Object.keys(groups).sort().map((day) => {
      const items = groups[day].map(({ e, s }) => `
        <li>
          <span class="t">${U.esc(s.time)}</span>
          <div><h3><a href="${U.eventHref(e.id)}" style="color:var(--ink)">${U.esc(e.title)}</a></h3>
          <span class="venue">${U.esc(s.venue || e.venue)}</span></div>
          <span class="cat">${U.esc(U.catName(e.category))}</span>
        </li>`).join("");
      const label = day === "0" ? "All days & anytime" : (T.schedule[Number(day) - 1] ? T.schedule[Number(day) - 1].day + " · " + T.schedule[Number(day) - 1].date : "Day " + day);
      return `<h3 class="h3" style="margin-top:26px">${U.esc(label)}</h3><ul class="route-list">${items}</ul>`;
    }).join("");

    out.innerHTML = html;

    const workshops = list.filter((e) => e.category === "workshops").length;
    const competitions = list.filter((e) => e.category === "competitions" || e.category === "robowars").length;
    const dayCount = new Set(Object.keys(groups).filter((d) => d !== "0")).size;
    summary.innerHTML = `
      <div class="stat"><p class="num">${list.length}</p><h3>Events</h3><p>on your suggested route</p></div>
      <div class="stat"><p class="num">${dayCount || state.days.size || 3}</p><h3>Days</h3><p>covered by the route</p></div>
      <div class="stat"><p class="num">${competitions}</p><h3>Competitions</h3><p>arenas to enter or watch</p></div>`;
    if (note) note.textContent = `${list.length} events matched. Workshops on route: ${workshops}.`;
  }

  build?.addEventListener("click", buildRoute);
})();
