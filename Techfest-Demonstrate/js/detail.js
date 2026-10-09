/* Techfest 2026 — event detail renderer. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const I = T.icon || {};
  const root = document.getElementById("eventDetail");
  if (!root || !U) return;

  const id = new URLSearchParams(location.search).get("id");
  const e = U.eventById(id);

  if (!e) {
    root.innerHTML = `
      <section class="detail-hero">
        <p class="breadcrumb"><a href="index.html">Home</a> / <a href="events.html">Events</a></p>
        <h1 class="h2">Event not found</h1>
        <p class="lede">That event is not in the directory. Explore the full programme to find your arena.</p>
        <p><a class="btn btn-gold" href="events.html">Open the directory</a></p>
      </section>`;
    return;
  }

  document.title = `${e.title} | Techfest 2026`;
  const href = U.eventHref(e.id);

  const highlights = (e.highlights || []).length
    ? `<h3 class="h3" style="margin-top:44px">Highlights</h3>
       <ul class="highlights">${e.highlights.map((h) => `<li>${U.esc(h)}</li>`).join("")}</ul>`
    : "";

  const curriculum = (e.curriculum || []).length
    ? `<h3 class="h3" style="margin-top:44px">What you will cover</h3>
       <ol class="curriculum">${e.curriculum.map((c) => `<li>${U.esc(c)}</li>`).join("")}</ol>`
    : "";

  const faqs = (e.faqs || []).length
    ? `<h3 class="h3" style="margin-top:44px">Questions</h3>
       <div class="faq">${U.faqs(e.faqs)}</div>`
    : "";

  const g = (T.genomes && T.genomes[e.category]) || { form: "grid", accent: "#d4af78" };
  const sp = (T.speakers || []).find((s) => s.eventId === e.id);

  const genomePanel = `<canvas class="genome genome--panel" data-genome data-form="${U.esc(g.form)}" data-accent="${U.esc(g.accent)}" aria-hidden="true" style="margin-top:24px"></canvas>`;

  const outcome = e.outcome
    ? `<div class="card" style="margin-top:28px"><span class="tag">Learning outcomes</span><p class="sub" style="margin-top:10px">${U.esc(e.outcome)}</p></div>`
    : "";

  const rules = (e.rules || []).length
    ? `<h3 class="h3" style="margin-top:44px">Rules &amp; format</h3>
       <ul class="rules">${e.rules.map((r) => `<li>${U.esc(r)}</li>`).join("")}</ul>`
    : "";

  const timeline = (e.timeline || []).length
    ? `<h3 class="h3" style="margin-top:44px">Timeline</h3>
       <ol class="steps">${e.timeline.map((s) => `<li class="step"><span class="when">${U.esc(s.t)}</span><span class="what">${U.esc(s.d)}</span></li>`).join("")}</ol>`
    : "";

  const speaker = sp
    ? `<h3 class="h3" style="margin-top:44px">Speaker</h3>
       <div class="speaker-grid" style="grid-template-columns:minmax(0,340px)">${U.speakerCard(e)}</div>`
    : "";

  const related = (T.events || [])
    .filter((x) => x.id !== e.id && (x.category === e.category || (x.pathways || []).some((p) => (e.pathways || []).includes(p))))
    .slice(0, 3);
  const relatedHTML = related.length
    ? `<h3 class="h3" style="margin-top:44px">Keep exploring</h3>
       <div class="event-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${related.map((r) => U.eventCard(r)).join("")}</div>`
    : "";

  const defs = [
    U.defRow("Date", e.date),
    U.defRow("Time", e.time),
    U.defRow("Venue", e.venue),
    U.defRow("Format", e.format),
    U.defRow("Team size", e.teamSize),
    U.defRow("Eligibility", e.eligibility),
    U.defRow("Fee", e.fee),
    U.defRow("Deadline", e.deadline),
    U.defRow("Prize", e.prize),
    U.defRow("Organiser", e.organizer),
    U.defRow("Instructor", e.instructor),
    U.defRow("Speaker", e.speakerRole)
  ].filter(Boolean).join("");

  const chips = [
    U.badge(e.status),
    e.date ? `<span class="chip">${I.clock || ""}${U.esc(e.date)}</span>` : "",
    e.venue ? `<span class="chip">${I.pin || ""}${U.esc(e.venue)}</span>` : "",
    e.prize ? `<span class="chip">${I.trophy || ""}${U.esc(e.prize)}</span>` : ""
  ].filter(Boolean).join("");

  const registerLabel = e.status === "announcing" ? "Get notified" : "Register";

  root.innerHTML = `
    <section class="detail-hero">
      <p class="breadcrumb"><a href="index.html">Home</a> / <a href="events.html">Events</a> / <a href="events.html?cat=${U.esc(e.category)}">${U.esc(U.catName(e.category))}</a></p>
      <span class="tag">${U.esc(U.catName(e.category))}</span>
      <h1 class="h2" style="margin-top:12px">${U.esc(e.title)}</h1>
      <p class="hero-theme" style="margin:14px 0 10px">${U.esc(e.tagline)}</p>
      <p class="lede">${U.esc(e.blurb)}</p>
      <div class="chip-row">${chips}</div>
    </section>

    <section class="section section--wide" style="padding-top:24px">
      <div class="detail-grid">
        <div>
          <div class="detail-media">
            <img src="${U.img(e)}" alt="${U.esc(e.title)}" loading="lazy" decoding="async" width="1200" height="640" />
          </div>
          ${genomePanel}
          <h3 class="h3" style="margin-top:40px">About this event</h3>
          <p class="sub" style="font-size:16px">${U.esc(e.description)}</p>
          ${outcome}
          ${highlights}
          ${curriculum}
          ${rules}
          ${timeline}
          ${speaker}
          ${faqs}
          ${relatedHTML}
        </div>

        <aside>
          <div class="sticky-cta">
            <div class="def-list">
              ${defs}
              ${e.contact ? `<div class="row"><dt>Contact</dt><dd><a href="mailto:${U.esc(e.contact)}" style="color:var(--gold)">${U.esc(e.contact)}</a></dd></div>` : ""}
            </div>
            <a class="btn btn-gold btn-lg" href="register.html?event=${encodeURIComponent(e.id)}">${registerLabel}</a>
            <a class="btn btn-ghost" href="events.html">Back to directory</a>
            <p class="progress-note">Competitive events register per team; workshops reserve individual seats. Registration closes ${U.esc(e.deadline || "at the stated deadline")}.</p>
          </div>
        </aside>
      </div>
    </section>`;
})();
