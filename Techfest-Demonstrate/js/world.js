/* Techfest 2026 — cinematic WebGL world.
   Fixed background scene: starfield, morphing particle field, Earth,
   the Aether Sentinel hero figure, and a Robowars arena. Camera is choreographed
   by scroll position against [data-stage] sections.

   Enhanced: twinkling multi-color starfield, three-stage particle morph
   with per-particle phase, fresnel atmosphere + glow sprites (bloom-like),
   detailed mascot with wave / blink / jet-flicker animation, expanded arena
   (cage bars, floor rings, truss, hazard core), bezier camera transitions
   with drift + scroll-velocity dolly, per-stage fog, dynamic lights. */
import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("tf-world");
if (canvas) init(canvas);

function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (e) {
    document.body.classList.add("no-webgl");
    document.body.classList.add("world-ready");
    canvas.remove();
    return;
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 760;
  const DPR = Math.min(devicePixelRatio || 1, small ? 2 : 2);

  renderer.setPixelRatio(DPR);
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x08080c, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08080c, 0.022);
  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 400);
  camera.position.set(0, 0, 9);

  const GOLD = new THREE.Color(0xd4af78);
  const CYAN = new THREE.Color(0x7ec8d8);
  const VIOLET = new THREE.Color(0x7857ff);
  const EMBER = new THREE.Color(0xff6a2b);

  /* ---------- lighting ---------- */
  const key = new THREE.DirectionalLight(0xf0d9a8, 1.1);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0x7857ff, 2.2, 60);
  rim.position.set(-8, -2, 4);
  scene.add(rim);
  const fill = new THREE.PointLight(0x7ec8d8, 1.6, 60);
  fill.position.set(7, 3, -4);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0x2a2a38, 1.1));
  const hemi = new THREE.HemisphereLight(0x3a3a55, 0x0a0a12, 0.5);
  scene.add(hemi);
  const mascotLight = new THREE.PointLight(0xd4af78, 1.2, 10);
  scene.add(mascotLight);
  const sweep = new THREE.SpotLight(0xfff2dd, 0.8, 60, Math.PI / 7, 0.5, 1.2);
  sweep.position.set(0, 10, 6);
  scene.add(sweep);
  scene.add(sweep.target);

  const world = new THREE.Group();
  scene.add(world);

  /* ---------- shared glow sprite (bloom-like) ---------- */
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.5)");
    grad.addColorStop(0.6, "rgba(255,255,255,0.1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  function makeGlow(color, scale, opacity, foggy = true) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: foggy
    }));
    s.scale.setScalar(scale);
    return s;
  }

  /* ---------- starfield: twinkling gold / cyan / white stars ---------- */
  const STAR_N = small ? 1400 : 3200;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STAR_N * 3);
  const starCol = new Float32Array(STAR_N * 3);
  const starScale = new Float32Array(STAR_N);
  const starPhase = new Float32Array(STAR_N);
  const palette = [new THREE.Color(0xf0d9a8), new THREE.Color(0x7ec8d8), new THREE.Color(0xffffff), new THREE.Color(0xffe9c4)];
  for (let i = 0; i < STAR_N; i++) {
    const r = 40 + Math.random() * 120;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    starPos[i * 3 + 2] = r * Math.cos(ph);
    const c = palette[(Math.random() * palette.length) | 0];
    starCol[i * 3] = c.r; starCol[i * 3 + 1] = c.g; starCol[i * 3 + 2] = c.b;
    starScale[i] = 0.5 + Math.random() * 1.7;
    starPhase[i] = Math.random() * Math.PI * 2;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
  starGeo.setAttribute("aScale", new THREE.BufferAttribute(starScale, 1));
  starGeo.setAttribute("aPhase", new THREE.BufferAttribute(starPhase, 1));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: small ? 2.4 : 2.8 } },
    vertexShader: `
      attribute float aScale;
      attribute float aPhase;
      uniform float uTime;
      uniform float uSize;
      varying vec3 vColor;
      varying float vTw;
      void main() {
        vColor = color;
        vTw = 0.55 + 0.45 * sin(uTime * 1.4 + aPhase);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * aScale * (0.7 + 0.3 * vTw) * (140.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, a * vTw);
      }`,
    vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // faint nebula sprites for depth
  const neb1 = makeGlow(0x7857ff, 90, 0.1, false); neb1.position.set(-50, 20, -80); scene.add(neb1);
  const neb2 = makeGlow(0x2a6a9a, 70, 0.08, false); neb2.position.set(60, -25, -70); scene.add(neb2);

  /* ---------- morphing particle field (cloud <-> ring <-> wave disc) ---------- */
  const P_N = small ? 1800 : 4200;
  const pGeo = new THREE.BufferGeometry();
  const pNow = new Float32Array(P_N * 3);
  const pA = new Float32Array(P_N * 3);   // sphere / cloud
  const pB = new Float32Array(P_N * 3);   // dispersed ring (earth / arena)
  const pC = new Float32Array(P_N * 3);   // flat wave disc (journey)
  const pPhase = new Float32Array(P_N);   // per-particle morph offset
  for (let i = 0; i < P_N; i++) {
    const rad = 3.4 + Math.random() * 3.6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const x = rad * Math.sin(ph) * Math.cos(th);
    const y = rad * Math.sin(ph) * Math.sin(th) * 0.7;
    const z = rad * Math.cos(ph);
    pA[i * 3] = x; pA[i * 3 + 1] = y; pA[i * 3 + 2] = z;
    const ang = Math.random() * Math.PI * 2;
    const rr = 7 + Math.random() * 7;
    pB[i * 3] = Math.cos(ang) * rr;
    pB[i * 3 + 1] = (Math.random() - 0.5) * 4;
    pB[i * 3 + 2] = Math.sin(ang) * rr * 0.5;
    const ang2 = Math.random() * Math.PI * 2;
    const rr2 = 4 + Math.random() * 8;
    pC[i * 3] = Math.cos(ang2) * rr2;
    pC[i * 3 + 1] = Math.sin(ang2 * 3 + rr2) * 0.6;
    pC[i * 3 + 2] = Math.sin(ang2) * rr2 * 0.6;
    pPhase[i] = Math.random();
    pNow[i * 3] = x; pNow[i * 3 + 1] = y; pNow[i * 3 + 2] = z;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pNow, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xd4af78, size: small ? 0.06 : 0.05, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
  const field = new THREE.Points(pGeo, pMat);
  world.add(field);

  // slow ambient dust layer
  const D_N = small ? 300 : 700;
  const dGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(D_N * 3);
  for (let i = 0; i < D_N; i++) {
    const r = 2 + Math.random() * 10, th = Math.random() * Math.PI * 2;
    dPos[i * 3] = Math.cos(th) * r;
    dPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    dPos[i * 3 + 2] = Math.sin(th) * r;
  }
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ color: 0x7ec8d8, size: 0.04, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }));
  world.add(dust);

  /* ---------- particle typography ----------
     particles dissolve out of the cloud and reform into words per stage */
  const TXT_N = small ? 1200 : 2600;
  const txtCanvas = document.createElement("canvas");
  txtCanvas.width = 1000; txtCanvas.height = 260;
  const tctx = txtCanvas.getContext("2d");
  function sampleWord(word) {
    tctx.clearRect(0, 0, txtCanvas.width, txtCanvas.height);
    tctx.fillStyle = "#fff";
    tctx.font = '700 158px "Space Grotesk", system-ui, sans-serif';
    tctx.textAlign = "center"; tctx.textBaseline = "middle";
    tctx.fillText(word, txtCanvas.width / 2, txtCanvas.height / 2);
    const d = tctx.getImageData(0, 0, txtCanvas.width, txtCanvas.height).data;
    const pts = [];
    for (let y = 0; y < txtCanvas.height; y += 4) {
      for (let x = 0; x < txtCanvas.width; x += 4) {
        if (d[(y * txtCanvas.width + x) * 4 + 3] > 128) pts.push([x, y]);
      }
    }
    return pts;
  }
  const WORD_STAGE = { hero: "TECHFEST", earth: "POWAI", compete: "COMPETE", discover: "DISCOVER", robowars: "ROBOWARS", night: "EXPERIENCE", journey: "2026" };
  const wordCache = {};
  function wordTargets(word) {
    if (wordCache[word]) return wordCache[word];
    const pts = sampleWord(word);
    const arr = new Float32Array(TXT_N * 3);
    const spanX = 11.5, spanY = 3.2;
    for (let i = 0; i < TXT_N; i++) {
      const p = pts.length ? pts[i % pts.length] : [0, 0];
      arr[i * 3] = (p[0] / txtCanvas.width - 0.5) * spanX + (Math.random() - 0.5) * 0.05;
      arr[i * 3 + 1] = -(p[1] / txtCanvas.height - 0.5) * spanY + (Math.random() - 0.5) * 0.05;
      arr[i * 3 + 2] = -0.4 + (Math.random() - 0.5) * 0.3;
    }
    wordCache[word] = arr;
    return arr;
  }
  const txtNow = new Float32Array(TXT_N * 3);
  const txtGeo = new THREE.BufferGeometry();
  txtGeo.setAttribute("position", new THREE.BufferAttribute(txtNow, 3));
  const txtMat = new THREE.PointsMaterial({ color: 0xf0d9a8, size: small ? 0.045 : 0.038, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const txtPoints = new THREE.Points(txtGeo, txtMat);
  txtPoints.position.set(0, 0.5, 1.6);
  world.add(txtPoints);
  let txtMix = 0, txtWord = null;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { for (const k in wordCache) delete wordCache[k]; });

  /* ---------- Earth ---------- */
  const earth = new THREE.Group();
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(6, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0x0b1020, emissive: 0x102040, emissiveIntensity: 0.5, roughness: 0.85, metalness: 0.1 })
  );
  earth.add(globe);
  const grid = new THREE.Mesh(
    new THREE.SphereGeometry(6.05, 36, 36),
    new THREE.MeshBasicMaterial({ color: 0x7ec8d8, wireframe: true, transparent: true, opacity: 0.14 })
  );
  earth.add(grid);
  const gridFine = new THREE.Mesh(
    new THREE.SphereGeometry(6.08, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xd4af78, wireframe: true, transparent: true, opacity: 0.08 })
  );
  earth.add(gridFine);
  const equator = new THREE.Mesh(new THREE.TorusGeometry(6.12, 0.015, 8, 96), new THREE.MeshBasicMaterial({ color: 0x7ec8d8, transparent: true, opacity: 0.5 }));
  equator.rotation.x = Math.PI / 2; earth.add(equator);
  const meridian = new THREE.Mesh(new THREE.TorusGeometry(6.12, 0.015, 8, 96), new THREE.MeshBasicMaterial({ color: 0x7ec8d8, transparent: true, opacity: 0.35 }));
  meridian.rotation.y = Math.PI / 2; earth.add(meridian);
  // fresnel atmosphere shell
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(6.9, 48, 48),
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0x4d9fd8) }, uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uTime;
        varying vec3 vN; varying vec3 vV;
        void main() {
          float f = pow(1.0 - abs(dot(vN, vV)), 2.6);
          float pulse = 0.85 + 0.15 * sin(uTime * 0.0012);
          gl_FragColor = vec4(uColor, f * 0.85 * pulse);
        }`,
      side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    })
  );
  earth.add(atmo);
  const earthGlow = makeGlow(0x2a6a9a, 17, 0.18);
  earth.add(earthGlow);
  const halo = new THREE.Points(
    (() => {
      const g = new THREE.BufferGeometry(), n = 700, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const r = 6.3 + Math.random() * 1.6, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        a[i * 3] = r * Math.sin(ph) * Math.cos(th); a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); a[i * 3 + 2] = r * Math.cos(ph);
      }
      g.setAttribute("position", new THREE.BufferAttribute(a, 3));
      return g;
    })(),
    new THREE.PointsMaterial({ color: 0xf0d9a8, size: 0.09, transparent: true, opacity: 0.7, depthWrite: false })
  );
  earth.add(halo);

  const geoToVec = (lat, lon, r) => {
    const phi = (90 - lat) * Math.PI / 180, theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
  };
  const india = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), new THREE.MeshBasicMaterial({ color: 0xf0d9a8 }));
  india.position.copy(geoToVec(21, 78, 6.12)); earth.add(india);
  const indiaGlow = makeGlow(0xd4af78, 1.4, 0.8);
  indiaGlow.position.copy(india.position); earth.add(indiaGlow);
  const indiaRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 8, 28), new THREE.MeshBasicMaterial({ color: 0xf0d9a8, transparent: true, opacity: 0.75 }));
  indiaRing.position.copy(india.position); indiaRing.lookAt(0, 0, 0); earth.add(indiaRing);
  const mumbai = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial({ color: 0x7ec8d8 }));
  mumbai.position.copy(geoToVec(19.1, 72.9, 6.12)); earth.add(mumbai);

  earth.position.set(-1, 0.4, -16);
  earth.visible = false;
  world.add(earth);

  /* ---------- hero figure: the Aether Sentinel ----------
     Graphite-and-gold explorer in a dynamic floating pose: reflective gold
     visor, thruster pack, raised presenting arm, trailing leg, orbit halo. */
  const mascot = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0x2b2e3a, roughness: 0.34, metalness: 0.85, emissive: 0x11131c, emissiveIntensity: 0.5 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd4af78, roughness: 0.3, metalness: 0.7, emissive: 0x3a2a10, emissiveIntensity: 0.6 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x7ec8d8, transparent: true, opacity: 0.9 });

  const head = new THREE.Group();
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), white);
  skull.scale.set(1, 0.94, 0.96);
  head.add(skull);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.51, 32, 32, 0.35, 2.45, 0.75, 0.85), new THREE.MeshStandardMaterial({ color: 0xd4af78, emissive: 0x7a5210, emissiveIntensity: 1.2, roughness: 0.22, metalness: 1.0 }));
  head.add(visor);
  const visorGlow = makeGlow(0x7ec8d8, 1.4, 0.3);
  visorGlow.position.set(0, 0.05, 0.28); head.add(visorGlow);
  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.1), gold);
  brow.position.set(0, 0.32, 0.4); head.add(brow);
  const chin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.08), gold);
  chin.position.set(0, -0.3, 0.42); head.add(chin);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), glow);
  eyeL.position.set(-0.15, 0.05, 0.42); head.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.15; head.add(eyeR);
  const earGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.07, 16);
  const earL = new THREE.Mesh(earGeo, gold); earL.rotation.z = Math.PI / 2; earL.position.set(-0.5, 0, 0); head.add(earL);
  const earR = earL.clone(); earR.position.x = 0.5; head.add(earR);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8), gold);
  antenna.position.set(0.18, 0.62, 0); antenna.rotation.z = -0.12; head.add(antenna);
  const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.08, 12), gold);
  antennaBase.position.set(0.19, 0.52, 0); head.add(antennaBase);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), glow);
  tip.position.set(0.2, 0.84, 0); head.add(tip);
  const tipGlow = makeGlow(0x7ec8d8, 0.5, 0.7);
  tipGlow.position.set(0.2, 0.84, 0); head.add(tipGlow);
  head.position.y = 1.32;
  mascot.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.16, 16), gold);
  neck.position.y = 0.94; mascot.add(neck);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 10, 28), gold);
  collar.rotation.x = Math.PI / 2; collar.position.y = 0.82; mascot.add(collar);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.45, 12, 24), white);
  torso.position.y = 0.35; mascot.add(torso);
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.52, 0.12), gold);
  chest.position.set(0, 0.44, 0.32); chest.rotation.x = -0.08; mascot.add(chest);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), glow);
  core.position.set(0, 0.46, 0.42); mascot.add(core);
  const coreGlow = makeGlow(0x7ec8d8, 0.9, 0.6);
  coreGlow.position.set(0, 0.46, 0.44); mascot.add(coreGlow);
  for (let i = 0; i < 3; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.02), gold);
    vent.position.set(-0.08 + i * 0.08, 0.12, 0.4);
    mascot.add(vent);
  }
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 32), white);
  belt.rotation.x = Math.PI / 2; belt.position.y = -0.1; mascot.add(belt);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), gold);
  buckle.position.set(0, -0.1, 0.38); mascot.add(buckle);

  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.58, 0.2), white);
  pack.position.set(0, 0.38, -0.42); mascot.add(pack);
  const packStripe = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.22), gold);
  packStripe.position.set(0, 0.6, -0.42); mascot.add(packStripe);
  const thrGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.3, 14);
  const thrL = new THREE.Mesh(thrGeo, gold); thrL.position.set(-0.16, 0.02, -0.55); thrL.rotation.x = 0.5; mascot.add(thrL);
  const thrR = thrL.clone(); thrR.position.x = 0.16; mascot.add(thrR);

  const shoulderGeo = new THREE.SphereGeometry(0.17, 16, 16);
  const shL = new THREE.Mesh(shoulderGeo, gold); shL.position.set(-0.5, 0.64, 0); mascot.add(shL);
  const shR = shL.clone(); shR.position.x = 0.5; mascot.add(shR);

  const upGeo = new THREE.CapsuleGeometry(0.1, 0.28, 8, 16);
  const foreGeo = new THREE.CapsuleGeometry(0.09, 0.24, 8, 16);
  const fistGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const cuffGeo = new THREE.TorusGeometry(0.1, 0.03, 8, 20);
  const mkArm = (side, baseZ) => {
    const g = new THREE.Group();
    const up = new THREE.Mesh(upGeo, white); up.position.y = -0.16; g.add(up);
    const cuff = new THREE.Mesh(cuffGeo, gold); cuff.position.y = -0.32; cuff.rotation.x = Math.PI / 2; g.add(cuff);
    const fore = new THREE.Mesh(foreGeo, white); fore.position.y = -0.48; g.add(fore);
    const fist = new THREE.Mesh(fistGeo, gold); fist.position.y = -0.7; g.add(fist);
    g.position.set(0.56 * side, 0.6, 0);
    g.rotation.z = baseZ;
    mascot.add(g);
    return g;
  };
  const armL = mkArm(-1, -0.5);
  const armR = mkArm(1, 2.35);

  const thighGeo = new THREE.CapsuleGeometry(0.13, 0.34, 8, 16);
  const bootGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const legL = new THREE.Mesh(thighGeo, white);
  legL.position.set(-0.2, -0.52, 0.14); legL.rotation.x = -0.55; mascot.add(legL);
  const bootL = new THREE.Mesh(bootGeo, gold);
  bootL.position.set(-0.2, -0.86, 0.36); mascot.add(bootL);
  const kneeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), gold);
  kneeL.position.set(-0.2, -0.62, 0.26); mascot.add(kneeL);
  const legR = new THREE.Mesh(thighGeo, white);
  legR.position.set(0.22, -0.52, -0.12); legR.rotation.x = 0.7; mascot.add(legR);
  const bootR = new THREE.Mesh(bootGeo, gold);
  bootR.position.set(0.24, -0.8, -0.4); mascot.add(bootR);
  const hipRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.03, 8, 32), gold);
  hipRing.rotation.x = Math.PI / 2; hipRing.position.y = -0.28; mascot.add(hipRing);
  const jet = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0x7ec8d8, transparent: true, opacity: 0.35 }));
  jet.position.set(0, -0.42, -0.5); jet.rotation.x = Math.PI - 0.4; mascot.add(jet);
  const jetGlow = makeGlow(0x7ec8d8, 1.1, 0.5);
  jetGlow.position.set(0, -0.62, -0.62); mascot.add(jetGlow);
  const jetLight = new THREE.PointLight(0x7ec8d8, 2.4, 12);
  jetLight.position.set(0, -0.5, -0.6); mascot.add(jetLight);

  const haloRig = new THREE.Group();
  const haloRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.018, 8, 72), gold);
  haloRig.add(haloRing);
  const haloOrb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 14), glow);
  haloRig.add(haloOrb);
  haloRig.position.y = 0.15;
  haloRig.rotation.x = 1.15;
  haloRig.rotation.y = 0.3;
  mascot.add(haloRig);

  mascot.position.set(2.6, -0.2, 3);
  mascot.scale.setScalar(0.95);
  world.add(mascot);

  /* ---------- Robowars arena ---------- */
  const arena = new THREE.Group();
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.4, 2.4, 48, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x0d0a12, roughness: 0.7, metalness: 0.3, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
  );
  arena.add(wall);
  const cage = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.4, 0.25, 48, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xd4af78, wireframe: true, transparent: true, opacity: 0.25 })
  );
  arena.add(cage);
  const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.4, 6);
  const barMat = new THREE.MeshBasicMaterial({ color: 0xd4af78, transparent: true, opacity: 0.5 });
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(Math.cos(a) * 4.4, 0, Math.sin(a) * 4.4);
    arena.add(bar);
  }
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4.2, 48), new THREE.MeshStandardMaterial({ color: 0x141018, roughness: 0.6, metalness: 0.4, emissive: 0x2a0d0d, emissiveIntensity: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.2; arena.add(floor);
  const polar = new THREE.PolarGridHelper(4.2, 12, 6, 48, 0xff6a2b, 0x3a2018);
  polar.position.y = -1.19;
  polar.material.transparent = true;
  polar.material.opacity = 0.35;
  arena.add(polar);
  const floorRing1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.03, 8, 64), new THREE.MeshBasicMaterial({ color: 0xff6a2b, transparent: true, opacity: 0.4 }));
  floorRing1.rotation.x = Math.PI / 2; floorRing1.position.y = -1.18; arena.add(floorRing1);
  const floorRing2 = floorRing1.clone(); floorRing2.scale.setScalar(1.45); arena.add(floorRing2);
  const core2 = new THREE.Mesh(new THREE.CircleGeometry(0.8, 32), new THREE.MeshBasicMaterial({ color: 0xff6a2b, transparent: true, opacity: 0.5 }));
  core2.rotation.x = -Math.PI / 2; core2.position.y = -1.17; arena.add(core2);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.3, 0.05, 12, 64), new THREE.MeshBasicMaterial({ color: 0xff6a2b, transparent: true, opacity: 0.6 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 1.1; arena.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.34, 0.02, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffb26b, transparent: true, opacity: 0.3 }));
  ring2.rotation.x = Math.PI / 2; ring2.position.y = 1.14; arena.add(ring2);
  const truss = new THREE.Mesh(new THREE.TorusGeometry(4.3, 0.06, 8, 64), new THREE.MeshStandardMaterial({ color: 0x2a2a33, roughness: 0.5, metalness: 0.7 }));
  truss.rotation.x = Math.PI / 2; truss.position.y = 1.2; arena.add(truss);
  const bulbGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffb26b });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(Math.cos(a) * 4.3, 1.13, Math.sin(a) * 4.3);
    arena.add(bulb);
  }
  const postGeo = new THREE.BoxGeometry(0.18, 2.4, 0.18);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x3a3a46, roughness: 0.4, metalness: 0.7 });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(Math.cos(a) * 4.4, 0, Math.sin(a) * 4.4);
    arena.add(post);
  }
  const arenaGlow = makeGlow(0xff6a2b, 8, 0.25);
  arenaGlow.position.y = 0.4; arena.add(arenaGlow);

  const botMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd6, roughness: 0.4, metalness: 0.6 });
  const mkBot = () => {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1.3), botMat); g.add(b);
    const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.18, 16), gold); w1.rotation.z = Math.PI / 2; w1.position.set(-0.55, -0.2, 0.4); g.add(w1);
    const w2 = w1.clone(); w2.position.x = 0.55; g.add(w2);
    const w3 = w1.clone(); w3.position.z = -0.4; g.add(w3);
    const w4 = w1.clone(); w4.position.set(-0.55, -0.2, -0.4); g.add(w4);
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 3), gold); blade.position.set(0, 0.1, 0.85); blade.rotation.x = Math.PI / 2; g.add(blade);
    return g;
  };
  const botA = mkBot(); botA.position.set(-2, -0.6, 0); arena.add(botA);
  const botB = mkBot(); botB.position.set(2, -0.6, 0); botB.rotation.y = Math.PI; arena.add(botB);

  const SPARK_N = small ? 400 : 900;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkBase = new Float32Array(SPARK_N * 3);
  for (let i = 0; i < SPARK_N; i++) {
    const a = Math.random() * Math.PI * 2, r = 0.5 + Math.random() * 3.4;
    sparkBase[i * 3] = Math.cos(a) * r; sparkBase[i * 3 + 1] = -1 + Math.random() * 2.6; sparkBase[i * 3 + 2] = Math.sin(a) * r;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkBase.slice(), 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xffb26b, size: 0.07, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
  arena.add(sparks);
  const arenaLight = new THREE.PointLight(0xff6a2b, 0, 30);
  arenaLight.position.set(0, 2, 0); arena.add(arenaLight);

  arena.position.set(0, -0.4, -2);
  arena.visible = false;
  world.add(arena);

  /* ---------- stage choreography ---------- */
  const CAM = {
    hero:     { pos: [0, 0.2, 9],    look: [0, 0, 0],       fov: 52, bg: 0x08080c, acc: 0x7857ff, roll: 0,      fog: 0.028 },
    earth:    { pos: [0, 1.2, 14],   look: [-0.6, 0.3, -10], fov: 50, bg: 0x070a14, acc: 0x7ec8d8, roll: 0.01,   fog: 0.02 },
    compete:  { pos: [1.2, 0.4, 11], look: [0.6, 0, 0],     fov: 54, bg: 0x0a0810, acc: 0xd4af78, roll: -0.015, fog: 0.03 },
    discover: { pos: [-1.4, 0.6, 12], look: [-0.4, 0.2, -2],  fov: 52, bg: 0x09080f, acc: 0x7ec8d8, roll: 0.012,  fog: 0.026 },
    robowars: { pos: [0, -0.2, 6.6], look: [0, -0.4, -2],  fov: 62, bg: 0x160708, acc: 0xff6a2b, roll: 0,      fog: 0.045 },
    night:    { pos: [0, 0.8, 12],   look: [0, 0.4, -3],    fov: 54, bg: 0x120a14, acc: 0xe06ad4, roll: -0.01,  fog: 0.035 },
    journey:  { pos: [0, 0.6, 12],   look: [0, 0.4, -12],   fov: 50, bg: 0x06070f, acc: 0xd4af78, roll: 0.008,  fog: 0.018 },
    register: { pos: [0, 0.2, 10],   look: [0, 0, 0],       fov: 52, bg: 0x0a0a12, acc: 0xd4af78, roll: 0,      fog: 0.028 }
  };
  const markers = [...document.querySelectorAll("[data-stage]")].map((el) => ({ el, stage: CAM[el.dataset.stage] ? el.dataset.stage : "hero" }));
  if (!markers.length) markers.push({ el: document.body, stage: "hero" });

  const bg = new THREE.Color(0x08080c);
  const acc = new THREE.Color(0x7857ff);
  const mascotAcc = new THREE.Color(0xd4af78);
  const tmpV = new THREE.Vector3();
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  let scrollT = 0, robowarsMix = 0, morphMix = 0, morphMix2 = 0, morphDirty = true, exploreMix = 0;
  let scrollVel = 0, lastScrollY = scrollY;

  addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  addEventListener("scroll", () => {
    scrollVel = Math.min(scrollVel + Math.abs(scrollY - lastScrollY) * 0.02, 3);
    lastScrollY = scrollY;
  }, { passive: true });

  const lerpN = (a, b, t) => a + (b - a) * t;
  const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

  function stageProgress() {
    const vh = innerHeight;
    const centers = markers.map((m) => {
      const r = m.el.getBoundingClientRect();
      return r.top + r.height / 2;
    });
    const mid = vh * 0.5;
    let idx = 0;
    for (let i = 0; i < centers.length; i++) if (centers[i] <= mid) idx = i;
    const a = markers[idx];
    const b = markers[Math.min(idx + 1, markers.length - 1)];
    let t = 0;
    if (b !== a) {
      const span = centers[idx + 1] - centers[idx];
      t = span ? Math.min(1, Math.max(0, (mid - centers[idx]) / span)) : 0;
    }
    return { a: a.stage, b: b.stage, t, idx };
  }

  function frame(time) {
    const { a, b, t: rawT } = stageProgress();
    const A = CAM[a] || CAM.hero, B = CAM[b] || A;
    const stageName = rawT < 0.5 ? a : b;
    const robowarsActive = /robowars/.test(stageName);
    const t = smoother(rawT);

    // camera: quadratic bezier arc through a control point between stages
    let cpx, cpy, cpz;
    if (a === b) {
      cpx = A.pos[0]; cpy = A.pos[1]; cpz = A.pos[2];
    } else {
      const mx = (A.pos[0] + B.pos[0]) / 2, my = (A.pos[1] + B.pos[1]) / 2, mz = (A.pos[2] + B.pos[2]) / 2;
      const lx = (A.look[0] + B.look[0]) / 2, ly = (A.look[1] + B.look[1]) / 2, lz = (A.look[2] + B.look[2]) / 2;
      let ox = mx - lx, oy = my - ly, oz = mz - lz;
      const ol = Math.hypot(ox, oy, oz) || 1;
      const dist = Math.hypot(B.pos[0] - A.pos[0], B.pos[1] - A.pos[1], B.pos[2] - A.pos[2]);
      const arc = 0.6 + dist * 0.05;
      const cx = mx + (ox / ol) * arc, cy = my + (oy / ol) * arc + 0.35, cz = mz + (oz / ol) * arc;
      const u = 1 - t;
      cpx = u * u * A.pos[0] + 2 * u * t * cx + t * t * B.pos[0];
      cpy = u * u * A.pos[1] + 2 * u * t * cy + t * t * B.pos[1];
      cpz = u * u * A.pos[2] + 2 * u * t * cz + t * t * B.pos[2];
    }
    // gentle drift + scroll-velocity dolly
    scrollVel *= 0.92;
    const dolly = Math.min(scrollVel * 0.3, 1.2);
    cpx += Math.sin(time * 0.00021) * 0.18;
    cpy += Math.cos(time * 0.00017) * 0.12;
    cpz -= dolly * 0.5;

    // "Explore 3D" mode: pointer orbits the current scene instead of scrolling
    const exploreOn = document.body.classList.contains("explore");
    exploreMix += ((exploreOn ? 1 : 0) - exploreMix) * 0.05;
    if (exploreMix > 0.001) {
      cpx += eased.x * 4.2 * exploreMix;
      cpy += -eased.y * 2.8 * exploreMix;
      cpz += exploreMix * 0.6;
    }

    camera.position.set(cpx, cpy, cpz);
    camera.fov = lerpN(A.fov, B.fov, t) + exploreMix * 4;
    camera.updateProjectionMatrix();
    tmpV.set(lerpN(A.look[0], B.look[0], t), lerpN(A.look[1], B.look[1], t), lerpN(A.look[2], B.look[2], t));
    camera.lookAt(tmpV);
    camera.rotateZ(lerpN(A.roll, B.roll, t) + Math.sin(time * 0.0003) * 0.008);

    // theme
    bg.set(A.bg); bg.lerp(new THREE.Color(B.bg), t);
    acc.set(A.acc); acc.lerp(new THREE.Color(B.acc), t);
    scene.background = bg;
    scene.fog.color.copy(bg);
    scene.fog.density = lerpN(A.fog, B.fog, t);
    rim.color.copy(acc);
    fill.color.copy(acc);
    key.color.copy(acc).lerp(GOLD, 0.5);
    pMat.color.copy(GOLD).lerp(acc, 0.4);

    // dynamic light intensity
    key.intensity = 1.1 + Math.sin(time * 0.0007) * 0.15;
    rim.intensity = 2.2 + Math.sin(time * 0.0009) * 0.5;
    fill.intensity = 1.6 + Math.cos(time * 0.0011) * 0.4;
    sweep.intensity = (robowarsActive ? 2.2 : 0.6) + Math.sin(time * 0.002) * 0.3;
    sweep.target.position.set(Math.cos(time * 0.0006) * 3, -0.5, Math.sin(time * 0.0006) * 3 - 2);
    sweep.target.updateMatrixWorld();

    // contextual mascot accent (changes with the zone)
    const ctxCol = stageName === "robowars" ? new THREE.Color(0xff6a2b)
      : stageName === "night" ? new THREE.Color(0xe06ad4)
      : stageName === "discover" || stageName === "earth" || stageName === "journey" ? new THREE.Color(0x7ec8d8)
      : GOLD;
    mascotAcc.lerp(ctxCol, 0.04);
    gold.color.copy(mascotAcc);
    gold.emissive.copy(mascotAcc).multiplyScalar(0.25);
    glow.color.copy(mascotAcc);
    jet.material.color.copy(mascotAcc);
    jetLight.color.copy(mascotAcc);
    visorGlow.material.color.copy(mascotAcc);
    coreGlow.material.color.copy(mascotAcc);
    tipGlow.material.color.copy(mascotAcc);
    jetGlow.material.color.copy(mascotAcc);
    mascotLight.color.copy(mascotAcc);

    // visibility per stage
    earth.visible = /earth|journey/.test(a) || /earth|journey/.test(b);
    arena.visible = /robowars/.test(a) || /robowars/.test(b);

    // earth motion
    earth.rotation.y += 0.0016;
    earth.position.y = 0.4 + Math.sin(time * 0.0004) * 0.15;
    atmo.material.uniforms.uTime.value = time;
    indiaRing.scale.setScalar(1 + Math.sin(time * 0.003) * 0.18);
    indiaRing.material.opacity = 0.45 + Math.sin(time * 0.003) * 0.3;

    // mascot
    eased.x += (pointer.x - eased.x) * 0.06;
    eased.y += (pointer.y - eased.y) * 0.06;
    mascot.position.x = 2.6 + eased.x * 1.2;
    mascot.position.y = -0.2 + Math.sin(time * 0.0012) * 0.16 - eased.y * 0.5;
    mascot.rotation.y = -0.5 + eased.x * 0.6;
    mascot.rotation.x = eased.y * 0.25;
    head.rotation.x = eased.y * 0.18;
    head.rotation.y = eased.x * 0.25;
    head.rotation.z = Math.sin(time * 0.0009) * 0.05;
    haloRig.rotation.z += 0.004;
    haloOrb.position.set(Math.cos(time * 0.0011) * 1.15, Math.sin(time * 0.0011) * 1.15, 0);
    armR.rotation.z = 2.35 + Math.sin(time * 0.0022) * 0.12;
    armR.rotation.x = Math.sin(time * 0.0022 + 1.3) * 0.1;
    armL.rotation.z = -0.5 + Math.sin(time * 0.0012) * 0.06;
    const blink = Math.pow(Math.max(0, Math.sin(time * 0.0011)), 60);
    eyeL.scale.y = eyeR.scale.y = 1 - blink * 0.85;
    jet.scale.y = 1 + Math.sin(time * 0.03) * 0.15;
    jetLight.intensity = 2.4 * (0.8 + 0.2 * Math.sin(time * 0.025));
    jetGlow.material.opacity = 0.35 + 0.2 * Math.sin(time * 0.025);
    mascotLight.position.set(mascot.position.x, mascot.position.y + 0.6, mascot.position.z + 1.6);
    mascotLight.intensity = 1.2 + Math.sin(time * 0.0013) * 0.3;
    if (robowarsActive) mascot.position.z = lerpN(3, 6.5, 1 - robowarsMix);
    else mascot.position.z = 3;
    mascot.visible = !robowarsActive || robowarsMix < 0.6;

    // arena intensity
    robowarsMix += ((/robowars/.test(a) ? 1 : 0) - robowarsMix) * 0.04;
    const intense = robowarsActive ? (robowarsMix || rawT) : robowarsMix * 0.4;
    arenaLight.intensity = intense * 6 * (0.85 + 0.15 * Math.sin(time * 0.02));
    ring.material.opacity = 0.25 + intense * 0.6;
    ring2.material.opacity = 0.1 + intense * 0.3;
    core2.material.opacity = 0.3 + intense * 0.4 + Math.sin(time * 0.004) * 0.1;
    arenaGlow.material.opacity = 0.15 + intense * 0.35;
    botA.position.x = -2 + Math.sin(time * 0.004) * (0.4 + intense * 1.1);
    botB.position.x = 2 + Math.cos(time * 0.0043) * (0.4 + intense * 1.1);
    botA.rotation.y = Math.sin(time * 0.002) * 0.4;
    botB.rotation.y = Math.PI + Math.cos(time * 0.002) * 0.4;
    if (intense > 0.05) {
      const pos = sparks.geometry.attributes.position;
      for (let i = 0; i < SPARK_N; i++) {
        const j = i * 3;
        pos.array[j] = sparkBase[j] + Math.sin(time * 0.006 + i) * 0.25 * intense;
        pos.array[j + 1] = sparkBase[j + 1] + ((time * 0.02 + i * 13) % 3) * 0.5 * intense - 1;
        pos.array[j + 2] = sparkBase[j + 2] + Math.cos(time * 0.005 + i) * 0.25 * intense;
      }
      pos.needsUpdate = true;
      sparks.material.opacity = 0.2 + intense * 0.8;
    }
    // tiny impact shake while the fight is hot
    if (intense > 0.3) {
      camera.position.x += (Math.random() - 0.5) * 0.04 * intense;
      camera.position.y += (Math.random() - 0.5) * 0.04 * intense;
    }

    // particle field morph: cloud <-> ring <-> wave disc, per-particle phase
    const targetMorph = /earth|discover|journey/.test(stageName) ? 1 : 0;
    const targetMorph2 = /journey/.test(stageName) ? 1 : 0;
    if (Math.abs(morphMix - targetMorph) > 0.002) {
      morphMix += (targetMorph - morphMix) * 0.05;
      morphDirty = true;
    }
    if (Math.abs(morphMix2 - targetMorph2) > 0.002) {
      morphMix2 += (targetMorph2 - morphMix2) * 0.05;
      morphDirty = true;
    }
    if (morphDirty) {
      const pos = field.geometry.attributes.position;
      for (let i = 0; i < P_N; i++) {
        const j = i * 3;
        const m1 = Math.min(1, Math.max(0, morphMix + (pPhase[i] - 0.5) * 0.35));
        const m2 = Math.min(1, Math.max(0, morphMix2 + (pPhase[i] - 0.5) * 0.3));
        const abx = lerpN(pA[j], pB[j], m1);
        const aby = lerpN(pA[j + 1], pB[j + 1], m1);
        const abz = lerpN(pA[j + 2], pB[j + 2], m1);
        pos.array[j] = lerpN(abx, pC[j], m2);
        pos.array[j + 1] = lerpN(aby, pC[j + 1], m2);
        pos.array[j + 2] = lerpN(abz, pC[j + 2], m2);
      }
      pos.needsUpdate = true;
      morphDirty = Math.abs(morphMix - targetMorph) > 0.002 || Math.abs(morphMix2 - targetMorph2) > 0.002;
    }
    field.rotation.y += 0.0006;
    dust.rotation.y += 0.0004;
    dust.rotation.x = Math.sin(time * 0.0002) * 0.1;
    starMat.uniforms.uTime.value = time * 0.001;
    stars.rotation.y -= 0.0002;
    stars.rotation.x = eased.y * 0.05;

    // particle typography: cloud dissolves and reforms as stage words
    const wantWord = WORD_STAGE[stageName] || null;
    if (wantWord !== txtWord) txtWord = wantWord;
    txtMix += (((txtWord ? 1 : 0)) - txtMix) * 0.05;
    txtMat.opacity = txtMix * 0.9;
    txtPoints.visible = txtMix > 0.01;
    if (txtMix > 0.01 && txtWord) {
      const tgt = wordTargets(txtWord);
      for (let i = 0; i < TXT_N; i++) {
        const j = i * 3;
        txtNow[j] = lerpN(txtNow[j], tgt[j], 0.09);
        txtNow[j + 1] = lerpN(txtNow[j + 1], tgt[j + 1], 0.09);
        txtNow[j + 2] = lerpN(txtNow[j + 2], tgt[j + 2], 0.09);
      }
      txtGeo.attributes.position.needsUpdate = true;
      txtPoints.rotation.y = Math.sin(time * 0.0003) * 0.05;
      txtPoints.scale.setScalar(1 + Math.sin(time * 0.001) * 0.02);
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  let raf = 0;
  let paused = false;

  function start() { if (!paused && !raf) raf = requestAnimationFrame(frame); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight);
  });
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (paused) stop(); else start();
  });

  if (reduce) {
    // single static render, no motion loop
    const { a } = stageProgress();
    const C = CAM[a] || CAM.hero;
    camera.position.set(C.pos[0], C.pos[1], C.pos[2]);
    camera.lookAt(C.look[0], C.look[1], C.look[2]);
    scene.fog.density = C.fog;
    earth.visible = true;
    renderer.render(scene, camera);
    addEventListener("scroll", () => {
      const s = stageProgress();
      const S = CAM[s.a] || CAM.hero;
      camera.position.set(S.pos[0], S.pos[1], S.pos[2]);
      camera.lookAt(S.look[0], S.look[1], S.look[2]);
      scene.fog.density = S.fog;
      renderer.render(scene, camera);
    }, { passive: true });
  } else {
    start();
  }
  document.body.classList.add("world-ready");
}
