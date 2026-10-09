# Techfest-Demonstrate
TECHFEST 2026 — An Astral Experience
A cinematic, interactive concept website for Techfest, IIT Bombay — Asia's largest science and technology festival — reimagined for its 29th edition (16–18 December 2026, Powai, Mumbai).

Purpose. This repository was built as a task submission for IIT Bombay's Techfest — a complete front-end concept demonstrating information architecture, visual identity, 3D storytelling, and interaction design for the festival's web presence. It is a concept platform, not the official site (the official site is techfest.org).

Highlights
Cinematic 3D hero — a Three.js world (starfield, particle typography, Earth, the "Aether Sentinel" hero figure, Robowars arena) choreographed by scroll, travelling from space to the Powai campus.
Complete event ecosystem — 30+ events across Competitions, Workshops, Lectures, Exhibitions, Robowars, and Technoholix, each with dates, venues, prize pools, eligibility, deadlines, curriculum, FAQs, and Register actions.
Event discovery — searchable/filterable directory (category, participant pathway, day) plus rich detail pages with related events.
Festival planning — three-day interactive schedule, "Build your Techfest" route planner, and a campus page with an interactive 3D digital twin of IIT Bombay's venues plus visitor guidance.
Festival depth — participant pathways (Student, Builder, Researcher, Startup, Visitor), speakers, exhibitions-as-installations, testimonials, past winners, partners, FAQs, and a 29-year legacy timeline (1998 → 2026).
Immersive Robowars sequence — full-screen 3D arena with countdown, impacts, sparks, and camera shake.
Editorial dark identity — Space Grotesk + Cormorant Garamond + IBM Plex Mono, gold/cyan/violet on near-black, grain, parallax photography, genome canvas signatures per category.
Accessible & responsive — semantic HTML, keyboard-navigable filters/tabs, prefers-reduced-motion fallbacks (static 3D renders), mobile/tablet/desktop layouts, lazy-loaded imagery, no-build performance.
Run it locally
The site uses ES modules (three.module.js), so it must be served over HTTP — opening the HTML files directly (file://) will not work.

Option 1 — one click (Windows): double-click start-site.bat, then open http://localhost:8080. Keep the window open while browsing.

Option 2 — terminal: from this folder, run

python -m http.server 8080
then open http://localhost:8080.

Project structure
index.html      Homepage — hero, scale, pathways, pillars, featured events,
                schedule/campus previews, Robowars, lectures, planner, legacy
events.html     Searchable/filterable event directory
event.html      Event detail page (?id=<event-id>)
schedule.html   Three-day schedule (?day=1|2|3)
campus.html     3D campus twin, schematic map, visitor planning, venues
plan.html       "Build your Techfest" route planner
register.html   Festival registration (pathway-based)
about.html      Story, timeline, winners, voices, partners, FAQs, contact
css/styles.css  Full design system (dark-only)
js/data.js      Central content model — meta, stats, events, schedule,
                timeline, speakers, exhibitions, interests, FAQs (edit here
                to change site content; no build step)
js/chrome.js    Nav, footer, cursor, reveal/parallax motion, countdown
js/ui.js        Shared render helpers (cards, badges, timelines, FAQs)
js/home.js      Homepage rendering (stats, pathways, pillars, previews…)
js/catalog.js   Directory search + filters
js/detail.js    Detail-page renderer + related events
js/world.js     Homepage cinematic Three.js world (scroll-choreographed)
js/robowars.js  Robowars arena simulation
js/campus3d.js  Campus digital twin · js/campus.js, schedule.js, plan.js,
                register.js, about.js — page controllers
js/vendor/      Three.js module
assets/         Photos, mark, favicons
Content model
All site content lives in js/data.js on window.TF — add an event object to TF.events (plus optional TF.eventDetails[id] for rules/timelines) and it automatically appears in the directory, search, schedule links, planner, and related-event rails.

Tech stack
Vanilla HTML + CSS + JavaScript, Three.js (vendored, no npm/build step), Google Fonts. No frameworks, no backend — registration and planner state are front-end concepts (localStorage where applicable).

Credits
Concept design & build for the Techfest 2026 web task. Festival facts (dates, venue, legacy) reference the real Techfest, IIT Bombay; branding, imagery, and copy here are original concept work.
