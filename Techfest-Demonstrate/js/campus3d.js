/* Techfest 2026 — IIT Bombay 3D campus digital twin.
   A stylised, interactive twin: venues as glowing buildings that can be selected,
   with the camera flying to the chosen location and labels tracking the 3D scene.
   Selection is shared with the flat map through the tf:venue event. */
import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("campus-canvas");
if (canvas) init(canvas);

function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (e) {
    document.body.classList.add("no-webgl");
    const host = canvas.closest(".campus3d"); if (host) host.style.display = "none";
    return;
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.3 : 1.7));
  renderer.setClearColor(0x0b0b12, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0b12, 0.02);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 160);

  scene.add(new THREE.AmbientLight(0x2a2a38, 1.1));
  const key = new THREE.DirectionalLight(0xf0d9a8, 1.15); key.position.set(6, 12, 8); scene.add(key);
  const rim = new THREE.PointLight(0x7857ff, 1.4, 60); rim.position.set(-10, 6, -6); scene.add(rim);
  const fill = new THREE.PointLight(0x7ec8d8, 1.1, 60); fill.position.set(9, 5, 6); scene.add(fill);

  const world = new THREE.Group();
  scene.add(world);

  /* ---------- ground + lake + roads ---------- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 24), new THREE.MeshStandardMaterial({ color: 0x0f0f16, roughness: 0.95, metalness: 0.05 }));
  ground.rotation.x = -Math.PI / 2; world.add(ground);
  const gridHelper = new THREE.GridHelper(30, 30, 0x2a2a38, 0x1a1a22);
  gridHelper.position.y = 0.01; world.add(gridHelper);

  const lake = new THREE.Mesh(new THREE.CircleGeometry(4.2, 40), new THREE.MeshStandardMaterial({ color: 0x0e2230, roughness: 0.25, metalness: 0.5, emissive: 0x0a2634, emissiveIntensity: 0.5 }));
  lake.rotation.x = -Math.PI / 2; lake.scale.set(1.1, 0.72, 1); lake.position.set(-8, 0.02, 4.5); world.add(lake);

  const roadMat = new THREE.MeshBasicMaterial({ color: 0x23232c });
  [[0, -0.6, 22, 0.5], [0, 5.2, 22, 0.4]].forEach(([x, z, len, wd]) => {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(len, wd), roadMat); road.rotation.x = -Math.PI / 2; road.position.set(x, 0.02, z); world.add(road);
  });
  const roadV = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 20), roadMat); roadV.rotation.x = -Math.PI / 2; roadV.position.set(-1.5, 0.02, 0); world.add(roadV);

  /* ---------- venue layout + buildings ---------- */
  const LAYOUT = {
    convocation: { x: -3.5, z: -3.5, h: 2.6, zone: "Academic Core" },
    ltc:         { x: -0.5, z: -5.0, h: 1.8, zone: "Academic Core" },
    labs:        { x: -2.0, z: -1.6, h: 1.3, zone: "Academic Core" },
    expo:        { x: 3.8,  z: -3.4, h: 2.0, zone: "North Lawn" },
    hangar:      { x: 6.2,  z: -4.8, h: 1.7, zone: "North Lawn" },
    grounds:     { x: 1.0,  z: 1.2,  h: 0.5, zone: "Central" },
    arena:       { x: 5.0,  z: 2.6,  h: 1.5, zone: "Gymkhana Grounds" },
    oat:         { x: -4.8, z: 5.2,  h: 1.1, zone: "Powai Lake Lawns" },
    lakeside:    { x: -7.2, z: 1.8,  h: 0.5, zone: "Powai Lake" }
  };
  const ZONE_HEX = {
    "Academic Core": 0xd4af78, "North Lawn": 0x7ec8d8, "Gymkhana Grounds": 0xff6a2b,
    "Powai Lake": 0x7857ff, "Powai Lake Lawns": 0x9a7bff, "Central": 0xf0d9a8
  };

  const buildings = [];
  const pickables = [];
  const venues = (window.TF && window.TF.venues) || [];

  venues.forEach((v) => {
    const L = LAYOUT[v.id];
    if (!L) return;
    const hex = ZONE_HEX[L.zone] || 0xd4af78;
    const g = new THREE.Group();
    g.position.set(L.x, 0, L.z);

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, L.h, 1.7),
      new THREE.MeshStandardMaterial({ color: 0x17171f, roughness: 0.5, metalness: 0.4, emissive: hex, emissiveIntensity: 0.12 })
    );
    body.position.y = L.h / 2;
    g.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 1.3), new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.5, roughness: 0.4 }));
    roof.position.y = L.h + 0.06; g.add(roof);

    /* window bands */
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.14, 1.74), new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.5 }));
    band.position.y = L.h * 0.62; g.add(band);

    /* glowing base ring */
    const base = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.05, 8, 40), new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.55 }));
    base.rotation.x = Math.PI / 2; base.position.y = 0.04; g.add(base);

    body.userData.venueId = v.id;
    body.userData.hex = hex;
    g.userData = { venueId: v.id, body, base, hex, height: L.h };
    buildings.push(g);
    pickables.push(body);
    world.add(g);
  });

  /* ---------- labels ---------- */
  const nodes = canvas.closest(".campus3d")?.querySelector(".c3d-nodes");
  const labels = new Map();
  if (nodes) {
    venues.forEach((v) => {
      const L = LAYOUT[v.id]; if (!L) return;
      const el = document.createElement("span");
      el.className = "c3d-label";
      el.textContent = v.name;
      el.dataset.venue = v.id;
      nodes.appendChild(el);
      labels.set(v.id, el);
    });
  }

  /* ---------- camera orbit + focus ---------- */
  const center = new THREE.Vector3(0, 0, 0);
  const desiredCenter = new THREE.Vector3(0, 0, 0);
  let az = 0.7, r = 20, desiredR = 20, focusId = null, dragging = false, moved = false, px = 0, autoRot = true;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hover = null;

  function select(id) {
    focusId = id;
    const b = buildings.find((x) => x.userData.venueId === id);
    if (b) { desiredCenter.set(b.position.x * 0.7, 0.6, b.position.z * 0.7); desiredR = 9.5; }
    autoRot = false;
    buildings.forEach((g) => { g.userData.body.material.emissiveIntensity = g.userData.venueId === id ? 0.7 : 0.12; });
    if (window.TF && window.TF.ui && window.TF.selectVenue) window.TF.selectVenue(id, { fromTwin: true });
  }

  canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = false; px = e.clientX; canvas.setPointerCapture?.(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (dragging) {
      const dx = e.clientX - px; px = e.clientX;
      if (Math.abs(dx) > 3) moved = true;
      az -= dx * 0.006;
    }
  });
  canvas.addEventListener("pointerup", (e) => {
    dragging = false;
    if (moved) return;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (hit) select(hit.object.userData.venueId);
  });
  canvas.addEventListener("pointerleave", () => { dragging = false; });

  window.addEventListener("tf:venue", (e) => {
    const id = e.detail && e.detail.id;
    if (id && id !== focusId) {
      focusId = id;
      const b = buildings.find((x) => x.userData.venueId === id);
      if (b) { desiredCenter.set(b.position.x * 0.7, 0.6, b.position.z * 0.7); desiredR = 9.5; }
      buildings.forEach((g) => { g.userData.body.material.emissiveIntensity = g.userData.venueId === id ? 0.7 : 0.12; });
    }
  });

  /* ---------- resize ---------- */
  function resize() {
    const w = canvas.clientWidth || 640, h = canvas.clientHeight || 440;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  addEventListener("resize", resize);
  resize();

  /* ---------- render ---------- */
  const v3 = new THREE.Vector3();
  function placeLabels() {
    if (!nodes) return;
    const rect = canvas.getBoundingClientRect();
    buildings.forEach((g) => {
      const el = labels.get(g.userData.venueId); if (!el) return;
      v3.set(g.position.x, g.userData.height + 0.4, g.position.z).project(camera);
      const x = (v3.x * 0.5 + 0.5) * rect.width;
      const y = (-v3.y * 0.5 + 0.5) * rect.height;
      if (v3.z > 1) { el.style.display = "none"; }
      else { el.style.display = ""; el.style.left = x + "px"; el.style.top = y + "px"; }
    });
  }

  let raf = 0, last = 0, paused = false;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    const t = now / 1000;

    if (autoRot && !dragging) az += dt * 0.05;
    center.lerp(desiredCenter, 0.04);
    r += (desiredR - r) * 0.04;
    camera.position.set(center.x + Math.sin(az) * r, 8 + Math.sin(t * 0.3) * 0.3, center.z + Math.cos(az) * r);
    camera.lookAt(center.x, 0.6, center.z);

    /* hover */
    if (!dragging) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      const target = hit ? hit.object : null;
      if (target !== hover) {
        if (hover && hover.userData.venueId !== focusId) hover.material.emissiveIntensity = 0.12;
        hover = target;
        if (hover) { hover.material.emissiveIntensity = 0.55; canvas.style.cursor = "pointer"; }
        else canvas.style.cursor = dragging ? "grabbing" : "grab";
      }
    }

    buildings.forEach((g, i) => {
      const pulse = g.userData.venueId === focusId ? 0.6 + Math.sin(t * 4) * 0.3 : 0.5;
      g.userData.base.material.opacity = pulse;
      g.rotation.y = Math.sin(t * 0.4 + i) * 0.03;
    });
    placeLabels();
    renderer.render(scene, camera);
  }
  function start() { if (!paused && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  document.addEventListener("visibilitychange", () => { paused = document.hidden; if (paused) stop(); else start(); });

  reset();
  function reset() {
    az = 0.7; r = 20; desiredR = 20; focusId = null;
    desiredCenter.set(0, 0, 0);
    buildings.forEach((g) => { g.userData.body.material.emissiveIntensity = 0.12; });
  }

  if (reduce) {
    camera.position.set(11, 12, 13); camera.lookAt(0, 0.6, 0);
    buildings.forEach((g) => { g.userData.base.material.opacity = 0.6; });
    placeLabels();
    renderer.render(scene, camera);
    addEventListener("resize", () => { resize(); camera.position.set(11, 12, 13); camera.lookAt(0, 0.6, 0); placeLabels(); renderer.render(scene, camera); });
  } else {
    start();
  }
}
