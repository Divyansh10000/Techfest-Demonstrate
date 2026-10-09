/* Techfest 2026 — registration form. Classic script. */
(() => {
  const T = window.TF || {};
  const U = T.ui;
  const form = document.getElementById("regForm");
  if (!form || !U) return;

  const chips = document.getElementById("pathChips");
  const hidden = document.getElementById("pathwayInput");
  const note = document.getElementById("formNote");
  const interest = document.getElementById("interest");

  if (interest) {
    interest.innerHTML = `<option value="">Select a focus…</option>` +
      (T.categories || []).filter((c) => c.id !== "all").map((c) => `<option value="${U.esc(c.id)}">${U.esc(c.name)}</option>`).join("");
  }

  if (chips) {
    chips.innerHTML = (T.pathways || []).map((p) =>
      `<button class="chip" type="button" data-path="${U.esc(p.id)}">${U.esc(p.name)}</button>`
    ).join("");
    chips.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-on", c === b));
      hidden.value = b.dataset.path;
      clearError(document.getElementById("pathwayField"));
    });
  }

  const params = new URLSearchParams(location.search);
  const preselect = params.get("event");
  if (preselect && note) {
    const ev = U.eventById(preselect);
    if (ev) {
      note.textContent = `Registering your interest for “${ev.title}”. Complete the form to continue.`;
      if (interest) interest.value = ev.category;
    }
  }

  function clearError(field) {
    if (!field) return;
    field.classList.remove("has-error");
    const err = field.querySelector(".err");
    if (err) err.textContent = "";
  }

  function setError(el, msg) {
    const field = el.closest(".field");
    if (!field) return;
    field.classList.add("has-error");
    const err = field.querySelector(".err");
    if (err) err.textContent = msg;
  }

  function validate() {
    let ok = true;
    let first = null;
    form.querySelectorAll("[required]").forEach((el) => {
      const field = el.closest(".field");
      const msg = (field && field.dataset.err) || "Please complete this field.";
      let bad = false;
      if (el.type === "checkbox") bad = !el.checked;
      else bad = !String(el.value || "").trim();
      if (!bad && el.type === "email") bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim());
      if (!bad && el.type === "tel") bad = el.value.replace(/\D/g, "").length < 7;
      if (bad) {
        setError(el, msg);
        ok = false;
        if (!first) first = el;
      } else {
        clearError(field);
      }
    });
    return { ok, first };
  }

  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field");
    if (field && field.classList.contains("has-error")) clearError(field);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { ok, first } = validate();
    if (!ok) {
      if (note) {
        note.style.color = "#ff9d8a";
        note.textContent = "Please fix the highlighted fields and try again.";
      }
      first?.focus();
      return;
    }
    const name = String(form.elements.name.value || "").trim().split(" ")[0] || "there";
    if (note) {
      note.style.color = "var(--gold)";
      note.textContent = `Thank you, ${name}. Your registration is noted — we will email your pass details and next steps.`;
    }
    form.reset();
    chips?.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-on"));
    if (hidden) hidden.value = "";
  });
})();
