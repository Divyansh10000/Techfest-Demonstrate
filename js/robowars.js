/* Techfest 2026 — Robowars cinematic peak.
   A self-contained Three.js arena: two detailed robots, a caged pit, a countdown,
   scheduled impacts with sparks and controlled camera shake, then a reveal of the
   real event information. Runs only while the section is on screen. */
import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("robowars-canvas");
if (canvas) init(canvas);

function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (e) {
    document.body.classList.add("no-webgl");
    canvas.style.display = "none";
    return;
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 760;
  const DPR = Math.min(devicePixelRatio || 1, small ? 1.3 : 1.75);
  renderer.setPixelRatio(DPR);
  renderer.setSize(canvas.clientWidth || innerWidth, canvas.clientHeight || 640, false);
  renderer.setClearColor(0x0a0508, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0508, 0.022);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 3.4, 10);

  const GOLD = 0xd4af78, EMBER = 0xff6a2b, CYAN = 0x7ec8d8, STEEL = 0xc9ccd6;

  scene.add(new THREE.AmbientLight(0x33262a, 1.1));
  const key = new THREE.DirectionalLight(0xffd9a8, 1.3);
  key.position.set(5, 9, 6); scene.add(key);
  const ember = new THREE.PointLight(EMBER, 3, 40); ember.position.set(0, 3, 2); scene.add(ember);
  const rim = new THREE.PointLight(CYAN, 2, 40); rim.position.set(-7, 2, -3); scene.add(rim);

  const world = new THREE.Group();
  scene.add(world);

  /* ---------- arena ---------- */
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(7, 64),
    new THREE.MeshStandardMaterial({ color: 0x141018, roughness: 0.55, metalness: 0.5, emissive: 0x2a0d0d, emissiveIntensity: 0.7 })
  );
  floor.rotation.x = -Math.PI / 2;
  world.add(floor);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(6.9, 0.06, 12, 96), new THREE.MeshBasicMaterial({ color: 0xff6a2b, transparent: true, opacity: 0.7 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.02; world.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.03, 10, 96), new THREE.MeshBasicMaterial({ color: 0xd4af78, transparent: true, opacity: 0.35 }));
  ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.02; world.add(ring2);

  const cage = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 4.6, 40, 3, true),
    new THREE.MeshBasicMaterial({ color: 0xd4af78, wireframe: true, transparent: true, opacity: 0.1 })
  );
  cage.position.y = 2.3; world.add(cage);

  /* hazard stripes on the floor */
  const stripes = new THREE.Group();
  for (let i = 0; i < 24; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.9), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xd4af78 : 0x1a1a1a }));
    const a = (i / 24) * Math.PI * 2;
    s.position.set(Math.cos(a) * 6.4, 0.03, Math.sin(a) * 6.4);
    s.rotation.y = -a;
    stripes.add(s);
  }
  world.add(stripes);

  /* ---------- robot ---------- */
  function mkRobot(accent) {
    const g = new THREE.Group();
    const steel = new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.35, metalness: 0.7 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a2a32, roughness: 0.5, metalness: 0.6 });
    const acc = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.3, metalness: 0.6, emissive: accent, emissiveIntensity: 0.35 });
    const eye = new THREE.MeshBasicMaterial({ color: 0xff6a2b });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.6, 2.2), steel);
    chassis.position.y = 0.62; g.add(chassis);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 1.9), acc);
    plate.position.y = 0.98; g.add(plate);
    const wedge = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.1, 4), dark);
    wedge.rotation.x = Math.PI / 2; wedge.rotation.y = Math.PI / 4;
    wedge.position.set(0, 0.62, -1.35); g.add(wedge);

    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.26, 20);
    [[-0.85, 0.42, 0.75], [0.85, 0.42, 0.75], [-0.85, 0.42, -0.75], [0.85, 0.42, -0.75]].forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, dark); w.rotation.z = Math.PI / 2; w.position.set(x, y, z); g.add(w);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 12), acc); hub.rotation.z = Math.PI / 2; hub.position.set(x, y, z); g.add(hub);
    });

    const spinner = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.16, 0.22), acc);
    spinner.add(bar);
    const tipL = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 3), steel); tipL.rotation.z = Math.PI / 2; tipL.position.x = -1.1; spinner.add(tipL);
    const tipR = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 3), steel); tipR.rotation.z = -Math.PI / 2; tipR.position.x = 1.1; spinner.add(tipR);
    spinner.position.set(0, 1.18, 0.5); g.add(spinner);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.5), steel); head.position.set(0, 1.32, 0.9); g.add(head);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), eye); lamp.position.set(0, 1.32, 1.18); g.add(lamp);

    g.userData.spinner = spinner;
    return g;
  }

  const botA = mkRobot(0xd4af78);
  const botB = mkRobot(0x7ec8d8);
  botA.position.set(-3.6, 0, 0);
  botB.position.set(3.6, 0, 0);
  botB.rotation.y = Math.PI;
  world.add(botA, botB);

  /* ---------- sparks ---------- */
  const N = small ? 260 : 520;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(N * 3);
  const sparkVel = new Float32Array(N * 3);
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xffb26b, size: 0.09, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending }));
  sparks.position.set(0, 1.1, 0);
  world.add(sparks);
  let sparkLife = 0;
  function burst() {
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      sparkPos[j] = (Math.random() - 0.5) * 0.4;
      sparkPos[j + 1] = (Math.random() - 0.5) * 0.4;
      sparkPos[j + 2] = (Math.random() - 0.5) * 0.4;
      const a = Math.random() * Math.PI * 2, e = Math.random() * Math.PI;
      const sp = 2 + Math.random() * 7;
      sparkVel[j] = Math.cos(a) * Math.sin(e) * sp;
      sparkVel[j + 1] = Math.cos(e) * sp * 0.9 + 2;
      sparkVel[j + 2] = Math.sin(a) * Math.sin(e) * sp;
    }
    sparkLife = 1;
    sparks.material.opacity = 1;
  }

  /* ---------- countdown + state ---------- */
  const countEl = document.getElementById("rwCount");
  const stateEl = document.getElementById("rwState");
  const startBtn = document.getElementById("rwStart");
  const replayBtn = document.getElementById("rwReplay");
  const wrap = document.querySelector(".robowars-cinema");
  let state = "idle", countdown = 0, fightT = 0, impactAt = 0, impacts = 0, shake = 0;
  let charging = true;

  const setCount = (txt, label) => {
    if (countEl) countEl.innerHTML = `${txt}${label ? `<small>${label}</small>` : ""}`;
  };
  const setState = (s) => { if (stateEl) stateEl.textContent = s; };

  function beginCountdown() {
    if (state === "countdown" || state === "fight") return;
    state = "countdown"; countdown = 3.999;
    if (startBtn) startBtn.disabled = true;
    start();
  }
  function startFight() {
    state = "fight"; fightT = 0; impactAt = 0.6; impacts = 0; charging = true;
    setCount("FIGHT", "Bout live");
    if (stateEl) stateEl.textContent = "Bout in progress";
    burst(); shake = 0.9;
    if (wrap) { wrap.classList.remove("rw-shake"); void wrap.offsetWidth; wrap.classList.add("rw-shake"); }
  }
  function reset() {
    state = "idle"; countdown = 0; fightT = 0; impacts = 0; shake = 0;
    botA.position.x = -3.6; botB.position.x = 3.6;
    botA.rotation.y = 0; botB.rotation.y = Math.PI;
    setCount("3", "Tap to begin");
    setState("Ready");
    if (startBtn) startBtn.disabled = false;
    sparks.material.opacity = 0;
  }

  setCount("3", "Tap to begin");
  setState("Ready");
  startBtn?.addEventListener("click", beginCountdown);
  replayBtn?.addEventListener("click", () => { reset(); beginCountdown(); });

  /* ---------- loop ---------- */
  let raf = 0, last = 0, paused = false;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    const t = now / 1000;

    if (state === "countdown") {
      countdown -= dt;
      const n = Math.ceil(countdown);
      if (n !== null && n >= 1) setCount(String(n), n === 1 ? "Next: FIGHT" : "Bout begins");
      if (countdown <= 0) startFight();
    }

    if (state === "fight") {
      fightT += dt;
      impactAt -= dt;
      const clash = Math.abs(botA.position.x - botB.position.x);
      if (charging) {
        botA.position.x += dt * 1.5; botB.position.x -= dt * 1.5;
        if (botA.position.x >= -1.15) { botA.position.x = -1.15; botB.position.x = 1.15; charging = false; }
      } else {
        botA.position.x -= dt * 0.9; botB.position.x += dt * 0.9;
        if (botA.position.x <= -3.4) { botA.position.x = -3.4; botB.position.x = 3.4; charging = true; }
      }
      if (clash < 2.5 && impactAt <= 0) {
        impactAt = 1.4 + Math.random() * 0.7;
        impacts++;
        burst(); shake = 1;
        setState(`Impact ${impacts}`);
        if (wrap) { wrap.classList.remove("rw-shake"); void wrap.offsetWidth; wrap.classList.add("rw-shake"); }
      }
      botA.rotation.y = Math.sin(t * 2) * 0.14;
      botB.rotation.y = Math.PI + Math.sin(t * 2 + 1) * 0.14;
      botA.userData.spinner.rotation.y += dt * 22;
      botB.userData.spinner.rotation.y -= dt * 22;
    }

    if (state !== "idle") {
      botA.userData.spinner.rotation.y += dt * (state === "fight" ? 6 : 1.5);
      botB.userData.spinner.rotation.y -= dt * (state === "fight" ? 6 : 1.5);
    }

    /* sparks physics */
    if (sparkLife > 0) {
      sparkLife -= dt * 1.4;
      for (let i = 0; i < N; i++) {
        const j = i * 3;
        sparkVel[j + 1] -= 14 * dt;
        sparkPos[j] += sparkVel[j] * dt;
        sparkPos[j + 1] += sparkVel[j + 1] * dt;
        sparkPos[j + 2] += sparkVel[j + 2] * dt;
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparks.material.opacity = clamp(sparkLife, 0, 1);
    }

    /* camera: slow orbit + shake */
    shake = Math.max(0, shake - dt * 1.8);
    const baseX = Math.sin(t * 0.18) * 1.6;
    const baseZ = 9.4 - Math.sin(t * 0.1) * 0.8;
    camera.position.set(baseX + (Math.random() - 0.5) * shake * 0.6, 3.2 + (Math.random() - 0.5) * shake * 0.4, baseZ);
    camera.lookAt(0, 1, 0);
    ember.intensity = 3 + Math.sin(t * 6) * 1.2 + sparkLife * 6;
    ring.material.opacity = 0.5 + sparkLife * 0.5;
    stripes.rotation.y += dt * 0.05;

    renderer.render(scene, camera);
  }

  function start() { if (!paused && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || 640;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  addEventListener("resize", resize);
  resize();

  document.addEventListener("visibilitychange", () => { paused = document.hidden; if (paused) stop(); else if (state !== "idle") start(); });

  if (reduce) {
    /* static dramatic pose, no loop */
    botA.position.x = -1.2; botB.position.x = 1.2;
    botA.rotation.y = 0.14; botB.rotation.y = Math.PI - 0.14;
    setCount("2", "Robowars — 18 December");
    setState("Arena ready");
    if (startBtn) startBtn.disabled = true;
    camera.position.set(0.6, 3, 9.4); camera.lookAt(0, 1, 0);
    renderer.render(scene, camera);
    return;
  }

  /* auto-ignite when the section first comes into view */
  if ("IntersectionObserver" in window && wrap) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { if (state === "idle") beginCountdown(); start(); }
      else stop();
    }), { threshold: 0.25 });
    io.observe(wrap);
  } else {
    start();
  }
}
