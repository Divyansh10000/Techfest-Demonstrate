/* Techfest 2026 — shared chrome: navigation, footer, cursor, motion helpers.
   Vanilla script. Safe to include on every page. */
(() => {
  const T = (window.TF = window.TF || {});
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = (location.pathname.split("/").pop() || "index.html").replace(/^\s+|\s+$/g, "");

  const NAV = [
    { href: "index.html", label: "Home" },
    { href: "events.html", label: "Events" },
    { href: "schedule.html", label: "Schedule" },
    { href: "campus.html", label: "Campus" },
    { href: "plan.html", label: "Plan" },
    { href: "about.html", label: "About" }
  ];

  function navHTML() {
    const links = NAV.map(
      (n) => `<a href="${n.href}" class="nav-link ${page === n.href ? "is-on" : ""}"${page === n.href ? ' aria-current="page"' : ""}>${n.label}</a>`
    ).join("");
    return `
      <header class="nav" id="nav">
        <a class="nav-brand" href="index.html" aria-label="Techfest 2026 home">
          <img src="assets/tf-mark.png" alt="" width="64" height="34" />
          <span><strong>TECHFEST</strong><small>IIT BOMBAY · 2026</small></span>
        </a>
        <nav class="nav-links" aria-label="Primary">${links}</nav>
        <div class="nav-actions">
          <a class="btn btn-ghost" href="events.html">Explore Events</a>
          <a class="btn btn-gold" href="register.html">Register</a>
          <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu"><span></span><span></span></button>
        </div>
      </header>
      <div class="mobile-nav" id="mobileNav" hidden>
        ${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}
        <a href="register.html" class="btn btn-gold">Register</a>
      </div>`;
  }

  function footHTML() {
    return `
      <div class="foot-inner">
        <div class="foot-top">
          <div class="foot-brand">
            <img src="assets/tf-mark.png" alt="Techfest" width="88" height="46" />
            <p>Asia's largest science &amp; technology festival.<br />Student-run. IIT Bombay. Since 1998.</p>
          </div>
          <div class="foot-cols">
            <div><h3>Festival</h3>
              <a href="events.html">Event directory</a>
              <a href="schedule.html">Three-day schedule</a>
              <a href="campus.html">Campus map</a>
              <a href="register.html">Register</a>
            </div>
            <div><h3>Discover</h3>
              <a href="events.html?cat=competitions">Competitions</a>
              <a href="events.html?cat=robowars">Robowars</a>
              <a href="events.html?cat=lectures">Lectures</a>
              <a href="events.html?cat=entertainment">Technoholix</a>
            </div>
            <div><h3>Official</h3>
              <a href="${T.meta ? T.meta.official : "https://techfest.org"}" target="_blank" rel="noopener">techfest.org</a>
              <a href="${T.meta ? T.meta.iitb : "https://www.iitb.ac.in"}" target="_blank" rel="noopener">IIT Bombay</a>
              <a href="about.html#faq">FAQs</a>
              <a href="about.html#contact">Contact</a>
            </div>
          </div>
        </div>
        <p class="foot-giant" aria-hidden="true">TECHFEST</p>
        <div class="foot-bottom">
          <p>© 2026 Techfest, IIT Bombay. Concept platform — not the official site.</p>
          <p>16—18 DEC 2026 · POWAI · MUMBAI</p>
        </div>
      </div>`;
  }

  function mount() {
    const navSlot = $("#tf-nav");
    if (navSlot) navSlot.innerHTML = navHTML();
    const footSlot = $("#tf-footer");
    if (footSlot) {
      footSlot.classList.add("foot");
      footSlot.innerHTML = `<div class="foot-wash" aria-hidden="true"><img src="assets/photos/space.jpg" alt="" width="1600" height="900" loading="lazy" decoding="async" /></div>${footHTML()}`;
    }
    if (!$("#progress")) {
      const p = document.createElement("div");
      p.className = "progress";
      p.id = "progress";
      p.setAttribute("aria-hidden", "true");
      p.innerHTML = "<i></i>";
      document.body.prepend(p);
    }
    const cursor = $(".cursor");
    if (!cursor) {
      const c = document.createElement("div");
      c.className = "cursor";
      c.setAttribute("aria-hidden", "true");
      c.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
      document.body.append(c);
    }
  }

  function wireNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const mobile = $("#mobileNav");
    const onScroll = () => nav && nav.classList.toggle("solid", scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const close = () => {
      mobile?.setAttribute("hidden", "");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    };
    toggle?.addEventListener("click", () => {
      const open = mobile?.hasAttribute("hidden");
      if (open) mobile.removeAttribute("hidden");
      else mobile.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", !!open);
    });
    $$("a", mobile).forEach((a) => a.addEventListener("click", close));
    addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  function wireChrome() {
    const bar = $("#progress i");
    const onScroll = () => {
      if (!bar) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  function wireCursor() {
    const cursor = $(".cursor");
    if (!cursor) return;
    const ring = $(".cursor-ring", cursor);
    const dot = $(".cursor-dot", cursor);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, shown = false;
    const place = (el, px, py) => { if (el) el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`; };
    place(dot, x, y); place(ring, rx, ry);

    const activate = () => {
      if (shown) return;
      shown = true; rx = x; ry = y;
      document.body.classList.add("has-cursor");
      cursor.classList.add("is-active");
      place(ring, rx, ry);
    };
    const move = (cx, cy) => {
      x = cx; y = cy;
      activate();
      place(dot, x, y);
      if (reduce) place(ring, x, y);
    };

    // Prefer pointer events but keep a mousemove fallback so the cursor always
    // activates on real mice, regardless of browser/pointer-type quirks.
    addEventListener("pointermove", (e) => {
      const pt = e.pointerType;
      if (!pt || pt === "mouse" || pt === "pen") move(e.clientX, e.clientY);
    }, { passive: true });
    addEventListener("mousemove", (e) => {
      if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
      move(e.clientX, e.clientY);
    }, { passive: true });
    addEventListener("mouseleave", () => { shown = false; cursor.classList.remove("is-active", "grow"); });
    addEventListener("mousedown", () => cursor.classList.add("down"));
    addEventListener("mouseup", () => cursor.classList.remove("down"));

    if (!reduce) {
      const loop = () => {
        rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
        place(ring, rx, ry);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    const SEL = "a, button, input, select, textarea, .tilt, .event-card, .path-card, .pillar-world, .install, .chip, .interest-chip";
    document.addEventListener("mouseover", (e) => { if (shown && e.target.closest && e.target.closest(SEL)) cursor.classList.add("grow"); });
    document.addEventListener("mouseout", (e) => {
      const from = e.target.closest && e.target.closest(SEL);
      const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(SEL) : null;
      if (from && from !== to) cursor.classList.remove("grow");
    });
  }

  function wireMotion() {
    if (reduce) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    const els = $$(".reveal, .stat, .event-card, .tile, .path-card, .pillar");
    els.forEach((el) => el.classList.add("reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        en.target.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));

    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.26;
        const dy = (e.clientY - r.top - r.height / 2) * 0.26;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    const pl = $$("[data-parallax]");
    if (pl.length) {
      let t = false;
      const shift = () => {
        t = false;
        const vh = innerHeight;
        pl.forEach((el) => {
          const r = el.getBoundingClientRect();
          const y = ((r.top + r.height / 2) - vh / 2) / vh;
          el.style.setProperty("--py", `${(y * 28).toFixed(1)}px`);
        });
      };
      addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(shift); } }, { passive: true });
      shift();
    }
  }

  function wireCountdown() {
    const el = $("#tf-countdown");
    if (!el) return;
    const target = new Date(T.meta.start).getTime();
    const units = el.querySelectorAll("[data-unit]");
    const pad = (n) => String(Math.max(0, Math.floor(n))).padStart(2, "0");
    const paint = () => {
      const diff = Math.max(0, target - Date.now());
      const map = {
        d: diff / 86400000,
        h: (diff % 86400000) / 3600000,
        m: (diff % 3600000) / 60000,
        s: (diff % 60000) / 1000
      };
      units.forEach((u) => { u.textContent = pad(map[u.dataset.unit] ?? 0); });
    };
    paint();
    setInterval(paint, 1000);
  }

  function wireCountUp() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    const run = (el) => {
      const end = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const scale = el.dataset.unit ? 1000 : 1;
      const short = (v) => {
        if (el.dataset.unit === "L" && v >= 100000) return "1.2Cr+";
        const n = Math.round(v / scale);
        return prefix + (n >= 1000 && suffix.includes("K") ? Math.round(n / 1000) : n) + suffix;
      };
      if (reduce) { el.textContent = short(end); return; }
      const start = performance.now(), dur = 1500;
      const step = (t) => {
        const k = Math.min(1, (t - start) / dur);
        el.textContent = short(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.done) { e.target.dataset.done = "1"; run(e.target); io.unobserve(e.target); }
    }), { threshold: 0.4 });
    nums.forEach((n) => io.observe(n));
  }

  T.icon = {
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v3a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 20h6M12 12v8"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M15 20a6 6 0 0 1 6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'
  };

  T.eventById = (id) => (T.events || []).find((e) => e.id === id);

  document.addEventListener("DOMContentLoaded", () => {
    mount();
    wireNav();
    wireChrome();
    wireCursor();
    wireMotion();
    wireCountdown();
    wireCountUp();
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
    document.body.classList.add("ready");
  });
})();
