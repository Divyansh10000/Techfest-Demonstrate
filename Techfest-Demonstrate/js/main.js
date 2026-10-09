(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  document.body.classList.add("loading");

  const loader = $("#loader");
  const fill = $(".loader-fill");
  const count = $("#loaderCount");
  let p = 0;
  const tick = () => {
    p = Math.min(100, p + (reduce ? 100 : Math.random() * 9 + 4));
    if (fill) fill.style.width = p + "%";
    if (count) count.textContent = String(Math.floor(p)).padStart(2, "0");
    if (p < 100) requestAnimationFrame(tick);
    else {
      setTimeout(() => {
        loader?.classList.add("done");
        document.body.classList.remove("loading");
        document.body.classList.add("ready");
      }, reduce ? 0 : 280);
    }
  };
  requestAnimationFrame(tick);

  const cursor = $(".cursor");
  const ring = $(".cursor-ring");
  const dot = $(".cursor-dot");
  if (cursor && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      if (dot) {
        dot.style.left = x + "px";
        dot.style.top = y + "px";
      }
    });
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      requestAnimationFrame(loop);
    };
    if (!reduce) loop();
    else if (ring) {
      ring.style.left = x + "px";
      ring.style.top = y + "px";
    }
    $$("a, button, input, select, .event, .m, .pillar").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
    });
  }

  if (!reduce) {
    $$(".event, .m").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.28;
        const dy = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  const nav = $("#nav");
  const toggle = $("#navToggle");
  const mobile = $("#mobileNav");
  const bar = $("#progress i");
  const navAnchors = $$(".nav-links a");
  const sections = navAnchors
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);
  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle("solid", y > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar && max > 0) bar.style.transform = `scaleX(${Math.min(1, y / max)})`;
    let current = sections[0];
    sections.forEach((sec) => {
      if (sec.getBoundingClientRect().top < innerHeight * 0.38) current = sec;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("is-on", current && a.getAttribute("href") === `#${current.id}`);
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  toggle?.addEventListener("click", () => {
    const open = mobile?.hasAttribute("hidden");
    if (open) mobile.removeAttribute("hidden");
    else mobile.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  });
  const closeMobile = () => {
    mobile?.setAttribute("hidden", "");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };
  $$("a", mobile).forEach((a) => a.addEventListener("click", closeMobile));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobile();
  });

  const cd = $("#countdown");
  const target = Date.UTC(2026, 11, 18, 3, 30, 0);
  const pad = (n) => String(n).padStart(2, "0");
  const renderCount = () => {
    if (!cd) return;
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const set = (u, v) => {
      const n = cd.querySelector(`[data-unit="${u}"]`);
      if (n) n.textContent = pad(v);
    };
    set("d", d); set("h", h); set("m", m);
  };
  renderCount();
  setInterval(renderCount, 30000);

  const nums = $$(".num");
  const animateNum = (el) => {
    const end = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduce) {
      el.textContent = prefix + (suffix === "K+" ? Math.round(end / 1000) : end) + suffix;
      return;
    }
    const start = performance.now();
    const dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      const val = Math.round(end * e);
      if (suffix === "K+") el.textContent = prefix + Math.round(val / 1000) + "K+";
      else el.textContent = prefix + val + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const revealEls = $$(".stats article, .manifesto-left, .manifesto-right, .pillar, .event, .lecture-rail article, .day-list li, .campus-copy, .campus-panel, .register h2, .reg-form, .film, .shot, .vignette-copy, .mosaic, .lens .section-head");
  revealEls.forEach((el) => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          if (en.target.matches(".stats article")) {
            const n = en.target.querySelector(".num");
            if (n && !n.dataset.done) {
              n.dataset.done = "1";
              animateNum(n);
            }
          }
          io.unobserve(en.target);
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
    nums.forEach(animateNum);
  }

  const parallax = $$("[data-parallax]");
  if (!reduce && parallax.length) {
    let ticking = false;
    const shift = () => {
      ticking = false;
      const vh = innerHeight;
      parallax.forEach((el) => {
        const img = el.matches("img") ? el : el.querySelector("img");
        if (!img) return;
        const r = el.getBoundingClientRect();
        const y = ((r.top + r.height / 2) - vh / 2) / vh;
        el.style.setProperty("--py", `${(y * 28).toFixed(1)}px`);
      });
    };
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(shift);
    }, { passive: true });
    shift();
  }

  $("#regForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = $("#formNote");
    if (note) note.textContent = "Request received. Official registration lives at techfest.org — we'll send you there next.";
    e.currentTarget.reset();
  });

  const canvas = $("#aether");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, raf = 0;
  const blobs = [
    { x: 0.22, y: 0.28, r: 0.38, c: [118, 88, 255], a: 0.22, s: 0.00018, p: 0 },
    { x: 0.72, y: 0.42, r: 0.42, c: [40, 186, 210], a: 0.18, s: 0.00014, p: 1.7 },
    { x: 0.5, y: 0.78, r: 0.34, c: [212, 175, 120], a: 0.14, s: 0.00011, p: 3.1 },
    { x: 0.12, y: 0.72, r: 0.26, c: [90, 140, 255], a: 0.1, s: 0.00016, p: 4.4 }
  ];
  const stars = Array.from({ length: 70 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random() * 1.2 + 0.2,
    tw: Math.random() * Math.PI * 2
  }));

  const resize = () => {
    w = canvas.width = innerWidth * devicePixelRatio;
    h = canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = (t) => {
    const W = innerWidth, H = innerHeight;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#08080c";
    ctx.fillRect(0, 0, W, H);

    blobs.forEach((b, i) => {
      const ox = Math.sin(t * b.s + b.p) * W * 0.06;
      const oy = Math.cos(t * b.s * 0.8 + b.p) * H * 0.05;
      const x = b.x * W + ox;
      const y = b.y * H + oy;
      const rad = b.r * Math.min(W, H);
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
      g.addColorStop(1, "rgba(8,8,12,0)");
      ctx.globalCompositeOperation = i ? "screen" : "source-over";
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    stars.forEach((s) => {
      const a = 0.15 + Math.sin(t * 0.0015 + s.tw) * 0.12;
      ctx.fillStyle = `rgba(240,217,168,${a})`;
      ctx.fillRect(s.x * W, s.y * H, s.z, s.z);
    });

    const vg = ctx.createRadialGradient(W / 2, H * 0.4, W * 0.1, W / 2, H * 0.45, W * 0.75);
    vg.addColorStop(0, "rgba(8,8,12,0)");
    vg.addColorStop(1, "rgba(8,8,12,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    raf = requestAnimationFrame(draw);
  };

  if (reduce) {
    draw(0);
  } else {
    raf = requestAnimationFrame(draw);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduce) raf = requestAnimationFrame(draw);
  });
})();
