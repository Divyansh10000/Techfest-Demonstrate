/* Techfest 2026 — three-day schedule tabs. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const $ = (s) => document.querySelector(s);
  const tabs = $("#dayTabs");
  const panels = $("#dayPanels");
  if (!tabs || !panels || !U || !(T.schedule || []).length) return;

  const days = T.schedule;
  const params = new URLSearchParams(location.search);
  let active = Math.min(days.length - 1, Math.max(0, (parseInt(params.get("day"), 10) || 1) - 1));

  function render() {
    tabs.innerHTML = days.map((d, i) =>
      `<button class="chip${i === active ? " is-on" : ""}" role="tab" id="tab-${i}" aria-selected="${i === active}" aria-controls="day-${i}" data-i="${i}" type="button">${U.esc(d.day)} · ${U.esc(d.date)}</button>`
    ).join("");

    panels.innerHTML = days.map((d, i) => {
      const rows = d.blocks.map((b) => {
        const ev = b.eventId ? U.eventById(b.eventId) : null;
        return `<li>
          <span class="t">${U.esc(b.time)}</span>
          <div><h3>${U.esc(b.title)}</h3><span class="venue">${U.esc(b.venue)}</span></div>
          ${ev ? `<a class="tag" href="${U.eventHref(ev.id)}">Details →</a>` : `<span class="venue" aria-hidden="true"></span>`}
        </li>`;
      }).join("");
      return `<div class="day-panel${i === active ? " is-on" : ""}" id="day-${i}" role="tabpanel" aria-labelledby="tab-${i}">
        <p class="eyebrow">${U.esc(d.day)} — ${U.esc(d.theme)}</p>
        <ul class="sched-list">${rows}</ul>
      </div>`;
    }).join("");
  }

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (!b) return;
    active = Number(b.dataset.i);
    render();
  });

  render();
})();
