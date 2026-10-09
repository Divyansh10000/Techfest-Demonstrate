/* Techfest 2026 — about page renderer. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const $ = (s) => document.querySelector(s);
  if (!U) return;

  const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

  set("#aboutTimeline", U.timeline());
  set("#aboutQuotes", U.testimonials());
  set("#aboutPartners", U.partners());
  set("#faqList", U.faqs(T.faqs));

  const rows = (T.winners || []).map((w) =>
    `<tr><td>${U.esc(w.year)}</td><td>${U.esc(w.event)}</td><td>${U.esc(w.team)}</td><td>${U.esc(w.place)}</td></tr>`
  ).join("");
  set("#winnersTable", rows);
})();
