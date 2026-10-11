import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const params = new URLSearchParams(location.search);
const W = Number(params.get("w") || 1920);
const H = Number(params.get("h") || 1080);
const MODE = params.get("mode") || "desktop"; // desktop (swirl on the left) | mobile (square, swirl centered)
const FRAMES = Number(params.get("frames") || 360);

// Deterministic randomness, so every render of a frame is identical.
let seed = 20261012;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const range = (a, b) => a + (b - a) * rand();

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const BG = "#0a0a0a";
const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog("#1c1a18", 26, 50);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.85;

const key = new THREE.DirectionalLight("#fff0d8", 2.4);
key.position.set(6, 9, 8);
scene.add(key);
const rim = new THREE.DirectionalLight("#d6dde6", 1.4);
rim.position.set(-8, 3, -6);
scene.add(rim);
const fill = new THREE.DirectionalLight("#f3c48d", 0.6);
fill.position.set(-2, -6, 6);
scene.add(fill);

const camera = new THREE.PerspectiveCamera(MODE === "mobile" ? 40 : 30, W / H, 0.1, 100);

// Soft glow behind the swirl, so the background is not a flat color.
{
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(512, 512, 0, 512, 512, 512);
  grad.addColorStop(0, "#2a2622");
  grad.addColorStop(0.45, "#151311");
  grad.addColorStop(1, BG);
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false }));
  plane.position.set(MODE === "mobile" ? 0 : -9, 0.5, -22);
  scene.add(plane);
}

// ---------------------------------------------------------------- textures for the coin faces
function canvas(size = 512) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d")];
}

/** Draws an icon in white on black, into a fresh canvas. */
function iconCanvas(draw) {
  const [c, g] = canvas();
  g.fillStyle = "#000";
  g.fillRect(0, 0, 512, 512);
  g.save();
  g.fillStyle = "#fff";
  g.strokeStyle = "#fff";
  draw(g);
  g.restore();
  // A fine raised ring near the edge of every face.
  g.lineWidth = 10;
  g.strokeStyle = "#fff";
  g.beginPath();
  g.arc(256, 256, 228, 0, Math.PI * 2);
  g.stroke();
  return c;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

const markImage = await new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.src = "/mark.png";
});

const icons = {
  mark: iconCanvas((g) => {
    const [mc, mg] = canvas();
    const s = 360;
    mg.drawImage(markImage, 256 - s / 2, 256 - s / 2 - 6, s, s);
    mg.globalCompositeOperation = "source-in";
    mg.fillStyle = "#fff";
    mg.fillRect(0, 0, 512, 512);
    g.drawImage(mc, 0, 0);
  }),
  cross: iconCanvas((g) => {
    roundRect(g, 256 - 46, 256 - 140, 92, 280, 26);
    roundRect(g, 256 - 140, 256 - 46, 280, 92, 26);
  }),
  capsule: iconCanvas((g) => {
    g.translate(256, 256);
    g.rotate(-Math.PI / 4);
    roundRect(g, -150, -56, 300, 112, 56);
    g.fillStyle = "#000";
    g.fillRect(-6, -60, 12, 120);
  }),
  video: iconCanvas((g) => {
    roundRect(g, 108, 176, 210, 160, 34);
    g.beginPath();
    g.moveTo(334, 236);
    g.lineTo(404, 196);
    g.quadraticCurveTo(414, 190, 414, 202);
    g.lineTo(414, 310);
    g.quadraticCurveTo(414, 322, 404, 316);
    g.lineTo(334, 276);
    g.closePath();
    g.fill();
  }),
};

/** Bump map (soft edges), roughness map and color map: the raised design is bright, polished gold on a darker brushed field. */
function faceMaps(icon) {
  const [bc, bg] = canvas();
  bg.filter = "blur(3px)";
  bg.drawImage(icon, 0, 0);
  const [rc, rg] = canvas();
  rg.fillStyle = "#fff";
  rg.fillRect(0, 0, 512, 512);
  rg.globalCompositeOperation = "difference";
  rg.globalAlpha = 0.55;
  rg.drawImage(icon, 0, 0);
  const [cc, cg] = canvas();
  cg.fillStyle = "#9c7a45";
  cg.fillRect(0, 0, 512, 512);
  const [tint, tg] = canvas();
  tg.drawImage(icon, 0, 0);
  tg.globalCompositeOperation = "multiply";
  tg.fillStyle = "#ffe2a8";
  tg.fillRect(0, 0, 512, 512);
  cg.globalCompositeOperation = "lighten";
  cg.drawImage(tint, 0, 0);
  const bump = new THREE.CanvasTexture(bc);
  const rough = new THREE.CanvasTexture(rc);
  const color = new THREE.CanvasTexture(cc);
  color.colorSpace = THREE.SRGBColorSpace;
  return { bump, rough, color };
}

// ---------------------------------------------------------------- materials
const gold = new THREE.MeshPhysicalMaterial({ color: "#d8ad66", metalness: 1, roughness: 0.26, clearcoat: 0.25, clearcoatRoughness: 0.2 });
const ivory = new THREE.MeshPhysicalMaterial({ color: "#e4d9c6", metalness: 0, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.25 });
const sage = new THREE.MeshPhysicalMaterial({ color: "#86b29e", metalness: 0, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25 });

const faceMaterials = Object.fromEntries(
  Object.entries(icons).map(([name, icon]) => {
    const { bump, rough, color } = faceMaps(icon);
    return [
      name,
      new THREE.MeshPhysicalMaterial({
        map: color,
        metalness: 1,
        roughness: 0.55,
        roughnessMap: rough,
        bumpMap: bump,
        bumpScale: 4,
        clearcoat: 0.2,
        clearcoatRoughness: 0.3,
      }),
    ];
  }),
);

// ---------------------------------------------------------------- geometry
const FACE_R = 0.84;
const coinRim = new THREE.LatheGeometry(
  [
    [FACE_R, -0.05],
    [0.86, -0.085],
    [0.93, -0.095],
    [0.985, -0.075],
    [1.0, 0],
    [0.985, 0.075],
    [0.93, 0.095],
    [0.86, 0.085],
    [FACE_R, 0.05],
  ].map(([x, y]) => new THREE.Vector2(x, y)),
  128,
);
const faceTop = new THREE.CircleGeometry(FACE_R + 0.002, 128).rotateX(-Math.PI / 2).translate(0, 0.05, 0);
const faceBottom = new THREE.CircleGeometry(FACE_R + 0.002, 128).rotateX(Math.PI / 2).translate(0, -0.05, 0);

function coin(icon) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(coinRim, gold));
  g.add(new THREE.Mesh(faceTop, faceMaterials[icon]));
  g.add(new THREE.Mesh(faceBottom, faceMaterials[icon]));
  return g;
}

function halfCapsule(radius, length, from, material) {
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius * Math.sin(a), length + radius * Math.cos(a)));
  }
  pts.push(new THREE.Vector2(radius, from));
  return new THREE.Mesh(new THREE.LatheGeometry(pts, 64), material);
}

function capsule(bodyMaterial) {
  const g = new THREE.Group();
  g.add(halfCapsule(0.36, 0.55, -0.12, gold)); // the cap, slightly wider and overlapping the body
  const body = halfCapsule(0.345, 0.55, 0.1, bodyMaterial);
  body.rotation.x = Math.PI;
  g.add(body);
  return g;
}

const tabletGeometry = (() => {
  const pts = [new THREE.Vector2(0, 0.17)];
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * (Math.PI / 2);
    pts.push(new THREE.Vector2(0.62 * Math.sin(a) * 0.92, 0.07 + 0.1 * Math.cos(a)));
  }
  pts.push(new THREE.Vector2(0.6, 0.04), new THREE.Vector2(0.6, -0.04));
  for (let i = 12; i >= 0; i--) {
    const a = (i / 12) * (Math.PI / 2);
    pts.push(new THREE.Vector2(0.62 * Math.sin(a) * 0.92, -0.07 - 0.1 * Math.cos(a)));
  }
  return new THREE.LatheGeometry(pts, 64);
})();

// ---------------------------------------------------------------- the swirl
const kinds = [];
const coinIcons = ["mark", "cross", "capsule", "video"];
for (let i = 0; i < 54; i++) {
  if (i % 4 === 1) kinds.push({ type: "capsule", material: i % 3 === 0 ? sage : ivory });
  else if (i % 9 === 3) kinds.push({ type: "tablet" });
  else kinds.push({ type: "coin", icon: coinIcons[(i * 7) % 4] });
}

const items = kinds.map((kind, i) => {
  let object;
  if (kind.type === "coin") object = coin(kind.icon);
  else if (kind.type === "capsule") object = capsule(kind.material);
  else object = new THREE.Mesh(tabletGeometry, rand() > 0.5 ? ivory : sage);

  const size = kind.type === "coin" ? range(0.7, 0.9) : kind.type === "capsule" ? range(0.8, 1.05) : range(0.6, 0.8);
  const holder = new THREE.Group();
  holder.add(object);
  scene.add(holder);

  return {
    holder,
    size,
    // Where along the vortex this object starts; each one travels the whole way once per loop.
    start: i / kinds.length + range(-0.012, 0.012),
    angle: range(0, Math.PI * 2),
    jitter: range(-0.6, 0.6),
    // Whole turns per loop, so the last frame meets the first.
    spins: kind.type === "coin" ? (rand() > 0.5 ? 1 : 2) : 1,
    axis: new THREE.Vector3(range(-1, 1), range(-0.4, 0.4), range(-1, 1)).normalize(),
    base: new THREE.Euler(range(0, Math.PI * 2), range(0, Math.PI * 2), range(0, Math.PI * 2)),
  };
});

/*
  A vortex: objects come out of the distance on a tight spiral, sweep wide as they near the
  viewer and pass out of frame, then begin again unseen in the distance.
*/
const DESK = MODE !== "mobile";
const vortex = {
  far: { z: -26, r: 2.2, x: DESK ? -6.5 : 0, y: DESK ? 0.8 : 0.4 },
  near: { z: 12, r: DESK ? 9 : 6.5, x: DESK ? -8.5 : 0, y: DESK ? -1 : 0 },
  turns: 1.5,
};
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, x) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
const baseQ = new THREE.Quaternion();
const spinQ = new THREE.Quaternion();

function update(t) {
  const turn = t * Math.PI * 2;
  for (const item of items) {
    const u = (item.start + t) % 1;
    // Ease the travel so objects linger mid-way and rush past at the end.
    const e = u * u * 0.3 + u * 0.7;
    const r = lerp(vortex.far.r, vortex.near.r, e * e) * (1 + item.jitter * 0.12);
    const a = item.angle + e * vortex.turns * Math.PI * 2;
    item.holder.position.set(
      lerp(vortex.far.x, vortex.near.x, e) + Math.cos(a) * r,
      lerp(vortex.far.y, vortex.near.y, e) + Math.sin(a) * r * 0.82 + item.jitter * 0.3,
      lerp(vortex.far.z, vortex.near.z, e),
    );
    item.holder.scale.setScalar(item.size * smooth(0, 0.12, u));
    baseQ.setFromEuler(item.base);
    spinQ.setFromAxisAngle(item.axis, turn * item.spins);
    item.holder.quaternion.copy(baseQ).multiply(spinQ);
  }
  const cx = Math.sin(turn) * 0.35;
  const cy = Math.cos(turn) * 0.2;
  camera.position.set(cx, cy, 22);
  camera.lookAt(DESK ? -0.4 : 0, DESK ? 0 : 0.2, 0);
}

window.renderFrame = (frame) => {
  update((frame % FRAMES) / FRAMES);
  renderer.render(scene, camera);
  return true;
};

window.glInfo = () => {
  const gl = renderer.getContext();
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown";
};

window.renderFrame(0);
window.ready = true;
