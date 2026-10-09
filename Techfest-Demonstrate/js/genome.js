/* Techfest 2026 — event genome signatures.
   Each category gets a distinct procedural visual language drawn on a 2D canvas:
   grid (Arena), gear (Impact), neural (Studio), orbit (Signal), node (Installation),
   beam (Spectrum). Only visible canvases animate. Classic script (window.TF.genome). */
window.TF = window.TF || {};
(() => {
  const T = window.TF;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = [];
  let raf = 0;
  const t0 = performance.now();

  const FORMS = {
    grid(ctx, w, h, t, a) {
      const hor = h * 0.6;
      ctx.strokeStyle = a; ctx.lineWidth = 1;
      ctx.globalAlpha = 0.22;
      for (let i = -6; i <= 6; i++) {
        const x = w / 2 + i * (w / 9);
        ctx.beginPath(); ctx.moveTo(w / 2 + i * 6, hor); ctx.lineTo(x * 1.9 - w * 0.45, h); ctx.stroke();
      }
      const off = (t * 0.25) % 1;
      for (let r = 0; r < 8; r++) {
        const k = (r + off) / 8;
        const y = hor + (h - hor) * k * k;
        ctx.globalAlpha = 0.12 + k * 0.5;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.globalAlpha = 0.9;
      for (let i = 0; i < 6; i++) {
        const p = (t * 0.4 + i / 6) % 1;
        ctx.fillStyle = a;
        ctx.globalAlpha = 0.5 + Math.sin(p * Math.PI) * 0.5;
        ctx.fillRect(w * p, hor + 6 + ((i * 37) % (h - hor - 10)), 3, 3);
      }
    },
    gear(ctx, w, h, t, a) {
      const cx = w * 0.5, cy = h * 0.72, R = Math.min(w, h) * 0.42;
      ctx.strokeStyle = a; ctx.fillStyle = a;
      const spin = t * 0.8;
      ctx.globalAlpha = 0.85;
      const teeth = 12;
      ctx.beginPath();
      for (let i = 0; i <= teeth * 2; i++) {
        const ang = spin + (i * Math.PI) / teeth;
        const rr = i % 2 ? R : R * 0.82;
        ctx.lineTo(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr);
      }
      ctx.closePath(); ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 0.7; ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.32, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 14; i++) {
        const ang = -spin * 2 + i, rad = R * (0.5 + 0.5 * Math.abs(Math.sin(t + i)));
        ctx.globalAlpha = 0.35 + 0.6 * Math.abs(Math.sin(t * 3 + i));
        ctx.fillRect(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad - 2, 2, 4);
      }
    },
    neural(ctx, w, h, t, a) {
      const n = 14, pts = [];
      for (let i = 0; i < n; i++) {
        pts.push([w * (0.12 + 0.76 * ((i * 0.618) % 1)), h * (0.2 + 0.6 * ((i * 0.382) % 1))]);
      }
      ctx.strokeStyle = a; ctx.fillStyle = a;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
          const d = Math.hypot(dx, dy);
          if (d < w * 0.26) {
            ctx.globalAlpha = 0.1 + 0.28 * Math.abs(Math.sin(t * 1.6 + i + j));
            ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
          }
        }
      }
      for (let i = 0; i < n; i++) {
        ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(t * 2 + i));
        ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 2.4, 0, Math.PI * 2); ctx.fill();
      }
    },
    orbit(ctx, w, h, t, a) {
      const cx = w * 0.5, cy = h * 0.55;
      ctx.strokeStyle = a; ctx.fillStyle = a;
      for (let r = 0; r < 3; r++) {
        const rx = w * (0.2 + r * 0.12), ry = rx * 0.34;
        ctx.globalAlpha = 0.22;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        const ang = t * (1.1 - r * 0.25) + r;
        ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry, 2.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.5; ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = h * 0.88 + Math.sin(x * 0.05 + t * 3) * 4 * Math.sin(x * 0.01);
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    },
    node(ctx, w, h, t, a) {
      const cols = 10, rows = 4, pad = w * 0.06;
      const gw = (w - pad * 2) / (cols - 1), gh = (h * 0.6) / (rows - 1);
      ctx.strokeStyle = a; ctx.fillStyle = a;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (x < cols - 1) { ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.moveTo(pad + x * gw, pad * 0.6 + y * gh); ctx.lineTo(pad + (x + 1) * gw, pad * 0.6 + y * gh); ctx.stroke(); }
          const lit = Math.abs(Math.sin(t * 1.4 + x * 0.7 + y * 1.3));
          ctx.globalAlpha = 0.2 + lit * 0.7;
          const s = 2 + lit * 2.4;
          ctx.fillRect(pad + x * gw - s / 2, pad * 0.6 + y * gh - s / 2, s, s);
        }
      }
    },
    beam(ctx, w, h, t, a) {
      const n = 22, gap = w / n;
      for (let i = 0; i < n; i++) {
        const k = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.6 + i * 0.5));
        const bh = h * k;
        const g = ctx.createLinearGradient(0, h - bh, 0, h);
        g.addColorStop(0, a); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.globalAlpha = 0.5;
        ctx.fillRect(i * gap + gap * 0.25, h - bh, gap * 0.5, bh);
      }
      ctx.globalAlpha = 0.8; ctx.fillStyle = a;
      ctx.fillRect(0, h - 2, w, 2);
    }
  };

  function size(c) {
    const r = c.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    }
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h, ctx };
  }

  function paint(it, t) {
    const { w, h, ctx } = size(it.canvas);
    ctx.clearRect(0, 0, w, h);
    (FORMS[it.form] || FORMS.grid)(ctx, w, h, t, it.accent);
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const t = (now - t0) / 1000;
    for (let i = 0; i < items.length; i++) if (items[i].visible) paint(items[i], t);
  }

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => {
        es.forEach((e) => { const it = items.find((x) => x.canvas === e.target); if (it) it.visible = e.isIntersecting; });
      }, { threshold: 0 })
    : null;

  function attach(canvas, form, accent) {
    if (!canvas || canvas.__genome) return;
    canvas.__genome = true;
    const it = { canvas, form: form || "grid", accent: accent || "#d4af78", visible: !io };
    items.push(it);
    if (io) io.observe(canvas);
    paint(it, 0);
  }

  function scan(root) {
    (root || document).querySelectorAll("[data-genome]").forEach((c) =>
      attach(c, c.dataset.form || c.dataset.genome, c.dataset.accent)
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    scan(document);
    if (!reduce && items.length) raf = requestAnimationFrame(loop);
  });

  T.genome = { attach, scan, forms: Object.keys(FORMS) };
})();
