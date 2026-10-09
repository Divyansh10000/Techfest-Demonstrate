/* Techfest 2026 — shared UI render helpers (window.TF.ui).
   Classic script. Depends on data.js (window.TF) and chrome.js (TF.icon). */
window.TF = window.TF || {};
(() => {
  const T = window.TF;
  const icon = () => T.icon || {};

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- imagery mapping ---------- */
  const IMG = {
    irc: "robot.jpg", codestorm: "code.jpg", robowars: "machine.jpg",
    meshmerize: "circuit.jpg", fullthrottle: "circuit.jpg", aerostorm: "drone.jpg",
    ideate: "engineer.jpg", hydraulics: "machine.jpg",
    deeplearning: "code.jpg", "autonomous-robotics": "robot.jpg", cubesat: "space.jpg",
    genai: "code.jpg", dronebuilding: "drone.jpg", cyberdefense: "hack.jpg",
    "lectures-orbit": "space.jpg", "lectures-command": "hall.jpg",
    "lectures-machine": "machine.jpg", "lectures-signal": "speaker.jpg",
    "expo-international": "hall.jpg", "expo-innovations": "engineer.jpg", "expo-defence": "drone.jpg",
    technoholix: "neon.jpg", lasershow: "lights.jpg", gamingarena: "crowd.jpg"
  };
  const CAT_IMG = {
    competitions: "robot.jpg", workshops: "workshop.jpg", lectures: "lecture.jpg",
    exhibitions: "hall.jpg", robowars: "machine.jpg", entertainment: "lights.jpg"
  };
  const img = (e) => "assets/photos/" + (IMG[e.id] || CAT_IMG[e.category] || "crowd.jpg");

  /* ---------- small builders ---------- */
  const BADGE = {
    open: ["badge--open", "Open"],
    "closing-soon": ["badge--closing", "Closing soon"],
    announcing: ["badge--announce", "Announcing"],
    soon: ["badge--soon", "Coming soon"],
    closed: ["", "Closed"]
  };
  const badge = (s) => {
    const b = BADGE[s] || BADGE.open;
    return `<span class="badge ${b[0]}">${b[1]}</span>`;
  };

  const catName = (id) => {
    const c = (T.categories || []).find((x) => x.id === id);
    return c ? c.name : id;
  };
  const genomeOf = (cat) => (T.genomes && T.genomes[cat]) || { form: "grid", accent: "#d4af78" };
  const eventById = (id) => (T.events || []).find((e) => e.id === id);
  const eventHref = (id) => `event.html?id=${encodeURIComponent(id)}`;

  function metaRow(e, opts = {}) {
    const i = icon();
    const bits = [];
    if (e.date) bits.push(`<span>${i.clock || ""}${esc(e.date)}</span>`);
    if (e.venue) bits.push(`<span>${i.pin || ""}${esc(e.venue)}</span>`);
    if (opts.prize && e.prize) bits.push(`<span>${i.trophy || ""}${esc(e.prize.split(" + ")[0])}</span>`);
    return `<div class="meta">${bits.join("")}</div>`;
  }

  function eventCard(e, opts = {}) {
    const cls = ["event-card", "reveal"];
    if (e.featured) cls.push("is-featured");
    if (opts.wide) cls.push("event-card--wide");
    if (opts.tall) cls.push("event-card--tall");
    const href = eventHref(e.id);
    const g = genomeOf(e.category);
    return `<article class="${cls.join(" ")}" data-category="${esc(e.category)}">
      <a class="media" href="${href}" aria-label="${esc(e.title)}">
        <img src="${img(e)}" alt="" loading="lazy" decoding="async" width="640" height="360" />
      </a>
      <div class="body">
        <span class="tag">${esc(catName(e.category))}</span>
        <h3><a href="${href}">${esc(e.title)}</a></h3>
        <p class="tagline">${esc(e.tagline)}</p>
        <p class="blurb">${esc(e.blurb)}</p>
        ${metaRow(e, { prize: true })}
        <canvas class="genome genome--card" data-genome data-form="${g.form}" data-accent="${g.accent}" aria-hidden="true"></canvas>
        <div class="foot">${badge(e.status)}<a class="btn btn-sm btn-ghost" href="${href}">Explore</a></div>
      </div>
    </article>`;
  }

  function defRow(label, value) {
    if (!value) return "";
    return `<div class="row"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
  }

  function speakerCard(e) {
    const sp = (T.speakers || []).find((s) => s.eventId === e.id);
    const portrait = sp && sp.img ? "assets/photos/" + sp.img : img(e);
    const name = sp && sp.name ? sp.name : e.title;
    const role = sp ? [sp.role, sp.org].filter(Boolean).join(" · ") : (e.speakerRole || "");
    const topic = sp && sp.topic ? sp.topic : e.tagline;
    const bio = sp && sp.bio ? sp.bio : e.blurb;
    return `<article class="speaker reveal">
      <div class="portrait"><img src="${portrait}" alt="" loading="lazy" decoding="async" width="480" height="640" /></div>
      <div class="info"><span class="tag">${esc(name)}</span><h3>${esc(topic)}</h3>
      <p>${esc(role)}</p>
      <p class="bio">${esc(bio)}</p></div>
    </article>`;
  }

  function testimonials() {
    return (T.testimonials || []).map((t) =>
      `<figure class="quote reveal"><p>“${esc(t.quote)}”</p>
       <cite>${esc(t.name)} · ${esc(t.role)} · ${esc(t.place)}</cite></figure>`
    ).join("");
  }

  function timeline() {
    return (T.timeline || []).map((t) =>
      `<li class="reveal"><span class="yr">${esc(t.year)}</span>
       <div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`
    ).join("");
  }

  function partners() {
    return (T.partners || []).map((p) =>
      `<div class="partner-tier reveal"><h3>${esc(p.tier)}</h3>
       <div class="partner-names">${p.names.map((n) => `<span>${esc(n)}</span>`).join("")}</div></div>`
    ).join("");
  }

  function faqs(list) {
    return (list || T.faqs || []).map((f) =>
      `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`
    ).join("");
  }

  T.ui = { esc, img, badge, catName, eventById, eventHref, metaRow, eventCard, defRow, speakerCard, testimonials, timeline, partners, faqs };
})();
