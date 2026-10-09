/* Techfest 2026 — homepage renderer. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const $ = (s, r = document) => r.querySelector(s);
  const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
  if (!U) return;

  const stats = $("#statGrid");
  if (stats) {
    stats.innerHTML = (T.stats || []).map((s) =>
      `<div class="stat reveal">
        <p class="num" data-count="${s.value}" data-suffix="${U.esc(s.suffix || "")}" data-prefix="${U.esc(s.prefix || "")}">0</p>
        <h3>${U.esc(s.label)}</h3><p>${U.esc(s.note)}</p>
      </div>`
    ).join("");
  }

  const quickNav = $("#quickNavGrid");
  if (quickNav) {
    const quickLinks = [
      { label: "Competitions", desc: "50+ arenas", href: "events.html?cat=competitions", icon: "trophy" },
      { label: "Workshops", desc: "Hands-on", href: "events.html?cat=workshops", icon: "users" },
      { label: "Lectures", desc: "Marquee", href: "events.html?cat=lectures", icon: "pin" },
      { label: "Exhibitions", desc: "Walk-around", href: "events.html?cat=exhibitions", icon: "pin" },
      { label: "Robowars", desc: "Flagship", href: "event.html?id=robowars", icon: "trophy" },
      { label: "Technoholix", desc: "Nights", href: "events.html?cat=entertainment", icon: "pin" }
    ];
    quickNav.innerHTML = quickLinks.map((q) =>
      `<a class="path-card reveal" href="${q.href}">
        <span class="idx">${U.esc(q.label)}</span>
        <h3>${U.esc(q.desc)}</h3>
        <span class="go">Explore →</span>
      </a>`
    ).join("");
  }

  const paths = $("#pathGrid");
  if (paths) {
    paths.innerHTML = (T.pathways || []).map((p, i) =>
      `<a class="path-card reveal" href="events.html?path=${U.esc(p.id)}" aria-label="${U.esc(p.name)} path">
        <span class="idx">0${i + 1} / Path</span>
        <h3>${U.esc(p.name)}</h3>
        <p>${U.esc(p.line)}</p>
        <span class="go">${U.esc(p.action)} →</span>
      </a>`
    ).join("");
  }

  const PILLAR_GENOME = { compete: "competitions", learn: "workshops", discover: "exhibitions", experience: "entertainment" };
  const pillars = $("#pillarGrid");
  if (pillars) {
    pillars.innerHTML = (T.pillars || []).map((p, i) => {
      const g = (T.genomes && T.genomes[PILLAR_GENOME[p.id]]) || { form: "grid", accent: "#d4af78" };
      return `<a class="pillar-world reveal" href="${U.esc(p.to)}" style="--accent:${U.esc(g.accent)}">
        <canvas class="genome" data-genome data-form="${U.esc(g.form)}" data-accent="${U.esc(g.accent)}" aria-hidden="true"></canvas>
        <div class="pw-body">
          <span class="idx">0${i + 1} · ${U.esc(p.kicker)}</span>
          <h3>${U.esc(p.name)}</h3>
          <p>${U.esc(p.line)}</p>
          <span class="go">Explore →</span>
        </div>
      </a>`;
    }).join("");
  }

  const featured = (T.events || []).filter((e) => e.featured && e.category !== "robowars").slice(0, 6);
  set("#featuredGrid", featured.map((e, i) => U.eventCard(e, { wide: i === 0 })).join(""));

  const installs = $("#installGrid");
  if (installs) {
    installs.innerHTML = (T.exhibitions || []).map((x) =>
      `<a class="install reveal" href="event.html?id=${U.esc(x.eventId)}" aria-label="${U.esc(x.title)}">
        <span class="zone">${U.esc(x.zone)}</span>
        <h3>${U.esc(x.title)}</h3>
        <p>${U.esc(x.blurb)}</p>
        <span class="flag${x.interactive ? "" : " off"}">${x.interactive ? "Hands-on" : "Viewing"} · ${U.esc(x.venue)} →</span>
      </a>`
    ).join("");
  }

  const speakers = (T.events || []).filter((e) => e.category === "lectures").slice(0, 4);
  set("#speakerGrid", speakers.map(U.speakerCard).join(""));

  const planner = $("#homePlanner");
  if (planner) {
    planner.innerHTML = (T.interests || []).slice(0, 9).map((it) =>
      `<span class="interest-chip">${U.esc(it.label)}</span>`
    ).join("");
  }

  const dayPreview = $("#dayPreviewGrid");
  if (dayPreview) {
    dayPreview.innerHTML = (T.schedule || []).map((d, i) => {
      const blocks = (d.blocks || []).slice(0, 3);
      const total = (d.blocks || []).length;
      return `<a class="card reveal" href="schedule.html?day=${i + 1}" aria-label="${U.esc(d.day)}, ${U.esc(d.date)}">
        <span class="tag">${U.esc(d.day)} · ${U.esc(d.date)}</span>
        <h3 class="h3" style="margin:10px 0 6px">${U.esc(d.theme)}</h3>
        <ul class="highlights" style="margin-top:8px">${blocks.map((b) =>
          `<li>${U.esc(b.time)} — ${U.esc(b.title)}</li>`).join("")}</ul>
        <span class="go" style="margin-top:12px;display:block;color:var(--gold);font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase">+ ${total - blocks.length} more blocks →</span>
      </a>`;
    }).join("");
  }

  set("#quoteGrid", U.testimonials());
  set("#homeTimeline", U.timeline());
  set("#partnersList", U.partners());

  // Explore 3D immersive toggle
  const toggle = $("#exploreToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const on = document.body.classList.toggle("explore");
      toggle.setAttribute("aria-pressed", on ? "true" : "false");
      toggle.setAttribute("aria-label", on ? "Return to guided scroll" : "Explore the world in 3D");
    });
  }

  // Safety: dismiss the loading veil even if the WebGL module is slow or blocked
  setTimeout(() => document.body.classList.add("world-ready"), 3000);
})();
