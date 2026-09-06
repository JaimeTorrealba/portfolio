<script setup>
import { reactive, shallowRef, onMounted, onUnmounted } from "vue";
import { useLoop, useTresContext } from "@tresjs/core";
import {
  InstancedMesh, PlaneGeometry, CanvasTexture,
  Matrix4, Vector3, Quaternion, Color, LinearFilter, ClampToEdgeWrapping,
} from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import {
  Fn, vec4, uniform, texture, uv, positionView, positionWorld, smoothstep, mix,
} from "three/tsl";
import { useMainStore } from "@/stores";
import { usePaneStore } from "@/stores/pane";

const mainStore = useMainStore();
const tier = await mainStore.resolveGPUTier();

// Billboard mist, after mrdoob's WebGL Clouds. The cost is overdraw rather than shader
// complexity -- one texture fetch and three smoothsteps per fragment -- so the quad count
// is the knob that matters, and it is what the GPU tier scales.
const MAX_COUNT = 140;
const getCount = () => {
  switch (tier.tier) {
    case 0: return 40;
    case 1:
    case 2: return 70;
    case 3: return 105;
    default: return MAX_COUNT;
  }
};

// Travel range. Quads spawn at Z_FAR, drift toward the viewer, and recycle once past
// Z_NEAR -- the same infinite loop the fireflies use in Precipitation.vue.
const Z_FAR = -80;
const Z_NEAR = 22;
const AREA_X = 80;
const Y_MIN = 2;
const Y_SPREAD = 8;

// The camera lives at z = 25 (theExperience.vue). CameraMouse.vue drifts it a little
// in X as you walk, but never in Z, which is all these depth fades depend on.
const CAMERA_Z = 25;
// The floor is a horizontal plane at y = -2 (Floor.vue).
const FLOOR_Y = -2;
const GROUND_FADE = 5;

// Both depth fades are derived from the travel range rather than exposed as sliders: they
// exist purely to hide the spawn and the recycle, so there is only ever one correct
// setting. A quad must be fully transparent before it reaches Z_NEAR, and must not pop in
// at Z_FAR.
const NEAR_FADE_START = (CAMERA_Z - Z_NEAR) * 2;
const NEAR_FADE_END = NEAR_FADE_START + 16;
const FAR_FADE_END = CAMERA_Z - Z_FAR;
const FAR_FADE_START = FAR_FADE_END - 35;

const options = reactive({
  opacity: 0.5,
  tint: "#5a6370",
  size: 18,
  speed: 12.5,
  count: getCount(),
});

// --- Texture -------------------------------------------------------------------------
// Drawn as opaque greyscale on black and read from .r, which sidesteps any premultiplied
// alpha ambiguity in CanvasTexture. Same canvas approach as Moon.vue's glow sprite.
const createPuffTexture = () => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);

  // A single radial gradient reads as a soft ball; several offset ones added together
  // give the irregular edge that makes a flat quad read as vapour.
  ctx.globalCompositeOperation = "lighter";
  const blob = (cx, cy, r, a) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(255,255,255," + a + ")");
    g.addColorStop(0.45, "rgba(255,255,255," + a * 0.35 + ")");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  };

  const c = size / 2;
  blob(c, c, c * 0.92, 0.20);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.6;
    const dist = c * (0.18 + Math.random() * 0.22);
    blob(
      c + Math.cos(angle) * dist,
      c + Math.sin(angle) * dist,
      c * (0.3 + Math.random() * 0.25),
      0.09
    );
  }

  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
};

const puffTexture = createPuffTexture();

// --- Per-quad state ------------------------------------------------------------------
// Allocated at the tier maximum so `count` can be raised live from the pane without
// rebuilding anything -- only `mesh.count` changes.
const positions = new Float32Array(MAX_COUNT * 3);
const scales = new Float32Array(MAX_COUNT);
const rolls = new Float32Array(MAX_COUNT);

const respawn = (i, initial) => {
  positions[i * 3] = (Math.random() - 0.5) * AREA_X;
  positions[i * 3 + 1] = Y_MIN + Math.random() * Math.random() * Y_SPREAD;
  // On the first fill, scatter through the corridor; afterwards always re-enter at the back.
  positions[i * 3 + 2] = initial ? Z_FAR + Math.random() * (Z_NEAR - Z_FAR) : Z_FAR;
};

for (let i = 0; i < MAX_COUNT; i++) {
  respawn(i, true);
  scales[i] = Math.random() * Math.random() * 1.2 + 0.5;
  rolls[i] = Math.random() * Math.PI;
}

// --- Material ------------------------------------------------------------------------
const uOpacity = uniform(options.opacity);
const uTint = uniform(new Color(options.tint));
// Matches the canvas clear colour, so distant quads dissolve into the background.
const uFogColor = uniform(new Color(0x111111));

const material = new MeshBasicNodeMaterial();
material.transparent = true;
material.depthWrite = false;
// Deliberately unlike the reference, which disables depth testing because its scene is
// nothing but clouds. Here the trees, grass and floor have to occlude the mist -- turning
// this off is exactly what made the old smoke paint over the entire scene.
material.depthTest = true;
material.fog = false;

material.colorNode = Fn(() => {
  // Linear eye depth: the TSL equivalent of gl_FragCoord.z / gl_FragCoord.w.
  const eyeDepth = positionView.z.negate();

  const puff = texture(puffTexture, uv()).r;
  const nearFade = smoothstep(NEAR_FADE_START, NEAR_FADE_END, eyeDepth);
  const fogFactor = smoothstep(FAR_FADE_START, FAR_FADE_END, eyeDepth);
  // A quad is a flat plane, so where it crosses the floor the opaque floor slices it in a
  // dead straight line. Fading it out by world height means it is already transparent by
  // the time it reaches the floor plane, and there is no intersection edge to see.
  const groundFade = smoothstep(FLOOR_Y, FLOOR_Y + GROUND_FADE, positionWorld.y);

  return vec4(
    mix(uTint, uFogColor, fogFactor),
    puff.mul(uOpacity).mul(nearFade).mul(groundFade)
  );
})();

// --- Mesh ----------------------------------------------------------------------------
const { camera } = useTresContext();
const groupRef = shallowRef();
let mesh = null;

const _mat = new Matrix4();
const _pos = new Vector3();
const _scl = new Vector3();
const _quat = new Quaternion();
const _roll = new Quaternion();
const _camQuat = new Quaternion();
const _zAxis = new Vector3(0, 0, 1);

// When motion is off the camera is frozen too (CameraMouse.vue also early-returns), so the
// matrices only need syncing once rather than every frame.
let frozenSynced = false;
const resync = () => { frozenSynced = false; };

const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  if (!mesh || !camera.activeCamera.value) return;

  const moving = !mainStore.reducedMotion;
  if (!moving && frozenSynced) return;
  frozenSynced = !moving;

  camera.activeCamera.value.getWorldQuaternion(_camQuat);
  const step = (delta ?? 0.016) * options.speed;

  for (let i = 0; i < mesh.count; i++) {
    if (moving) {
      positions[i * 3 + 2] += step;
      if (positions[i * 3 + 2] > Z_NEAR) respawn(i, false);
    }

    _pos.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    _scl.setScalar(options.size * scales[i]);
    // Face the camera, then roll about the view axis so the quads do not all look alike.
    _roll.setFromAxisAngle(_zAxis, rolls[i]);
    _quat.copy(_camQuat).multiply(_roll);
    _mat.compose(_pos, _quat, _scl);
    mesh.setMatrixAt(i, _mat);
  }

  mesh.instanceMatrix.needsUpdate = true;
});

onMounted(() => {
  const geometry = new PlaneGeometry(1, 1);
  mesh = new InstancedMesh(geometry, material, MAX_COUNT);
  mesh.count = options.count;
  mesh.instanceMatrix.setUsage(35048); // DYNAMIC_DRAW
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  groupRef.value.add(mesh);

  if (!window.location.href.includes("#debug")) return;
  const pane = usePaneStore().pane;
  const folder = pane.addFolder({ title: "Volumetric Smoke", expanded: false });

  folder
    .addBinding(options, "opacity", { min: 0, max: 2, step: 0.01 })
    .on("change", ({ value }) => { uOpacity.value = value; });
  folder
    .addBinding(options, "tint")
    .on("change", ({ value }) => { uTint.value.set(value); });
  folder
    .addBinding(options, "size", { min: 2, max: 60, step: 0.5 })
    .on("change", resync);
  folder.addBinding(options, "speed", { min: 0, max: 60, step: 0.5 });
  // The real performance lever: the instance buffer is already allocated at MAX_COUNT, so
  // this is live and free.
  folder
    .addBinding(options, "count", { min: 0, max: MAX_COUNT, step: 1 })
    .on("change", ({ value }) => {
      mesh.count = value;
      resync();
    });
});

onUnmounted(() => {
  mesh?.geometry.dispose();
  material.dispose();
  puffTexture.dispose();
});
</script>

<template>
  <TresGroup ref="groupRef" />
</template>
