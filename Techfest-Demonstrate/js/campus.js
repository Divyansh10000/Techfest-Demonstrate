/* Techfest 2026 — campus map + visitor planning. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const $ = (s) => document.querySelector(s);
  const frame = $("#mapFrame");
  const detail = $("#mapDetail");
  if (!U) return;

  const PINS = {
    convocation: [30, 28], ltc: [45, 20], labs: [39, 42],
    expo: [64, 30], hangar: [76, 18], grounds: [54, 58],
    arena: [72, 64], oat: [24, 76], lakeside: [14, 60]
  };
  const ZONE_COLOR = {
    "Academic Core": "var(--gold)",
    "North Lawn": "var(--cyan)",
    "Gymkhana Grounds": "var(--ember)",
    "Powai Lake": "var(--violet)",
    "Powai Lake Lawns": "var(--violet)",
    "Central": "var(--gold)"
  };
  const venues = T.venues || [];

  function show(id, opts) {
    const v = venues.find((x) => x.id === id) || venues[0];
    if (!v || !detail) return;
    const rel = (T.events || []).filter((e) => e.venueId === v.id);
    detail.innerHTML = `
      <span class="tag">${U.esc(v.zone)}</span>
      <h3 class="h3" style="margin:10px 0 8px">${U.esc(v.name)}</h3>
      <p class="sub">${U.esc(v.note)}</p>
      <p class="progress-note" style="margin-top:14px">${rel.length} ${rel.length === 1 ? "event" : "events"} hosted here</p>
      ${rel.length
        ? `<ul class="highlights" style="margin-top:14px">${rel
            .map((e) => `<li><a href="${U.eventHref(e.id)}" style="color:var(--ink)">${U.esc(e.title)}</a></li>`)
            .join("")}</ul>`
        : `<p class="sub">Nothing scheduled at this venue yet.</p>`}`;
    if (frame) frame.querySelectorAll(".pin-btn").forEach((b) => b.classList.toggle("is-on", b.dataset.venue === v.id));
    document.querySelectorAll("#venueList [data-venue]").forEach((b) => b.classList.toggle("is-on", b.dataset.venue === v.id));
    if (!opts || !opts.fromTwin) window.dispatchEvent(new CustomEvent("tf:venue", { detail: { id: v.id } }));
  }
  T.selectVenue = show;

  if (frame && venues.length) {
    frame.insertAdjacentHTML(
      "beforeend",
      venues
        .filter((v) => PINS[v.id])
        .map((v, i) =>
          `<button class="pin-btn" type="button" data-venue="${U.esc(v.id)}" style="left:${PINS[v.id][0]}%;top:${PINS[v.id][1]}%" aria-label="${U.esc(v.name)}" title="${U.esc(v.name)}">${i + 1}</button>`
        )
        .join("")
    );
    frame.addEventListener("click", (e) => {
      const b = e.target.closest(".pin-btn");
      if (b) show(b.dataset.venue);
    });
    show(venues[0].id);
  }

  const plan = $("#visitorPlan");
  if (plan) {
    plan.innerHTML = (T.visitorPlan || []).map((p) =>
      `<div class="card reveal"><h3 class="h3">${U.esc(p.title)}</h3>
        <ul class="highlights" style="margin-top:12px">${p.items.map((it) => `<li>${U.esc(it)}</li>`).join("")}</ul></div>`
    ).join("");
  }

  const list = $("#venueList");
  if (list) {
    list.innerHTML = venues.map((v) =>
      `<button class="card reveal" type="button" data-venue="${U.esc(v.id)}" style="text-align:left;cursor:pointer">
        <span class="tag" style="color:${ZONE_COLOR[v.zone] || "var(--gold)"}">${U.esc(v.zone)}</span>
        <h3 class="h3" style="margin:10px 0 6px">${U.esc(v.name)}</h3>
        <p class="sub">${U.esc(v.note)}</p>
      </button>`
    ).join("");
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-venue]");
      if (!b) return;
      show(b.dataset.venue);
      frame?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
