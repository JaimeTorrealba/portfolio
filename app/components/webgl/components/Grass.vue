<script setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";
import { BufferAttribute, InstancedBufferGeometry, Sphere, Vector2, Vector3, Vector4 } from "three";
import { useLoop } from "@tresjs/core";
import { MeshStandardNodeMaterial } from "three/webgpu";
import { usePaneStore } from "@/stores/pane";
import {
  varying,
  uniform,
  vec2,
  vec3,
  vec4,
  mat3,
  uvec2,
  uint,
  abs,
  bitAnd,
  bitOr,
  bitXor,
  dot,
  floor,
  fract,
  mix,
  mod,
  normalize,
  pow,
  shiftRight,
  sin,
  cos,
  smoothstep,
  floatBitsToUint,
  uintBitsToFloat,
  Discard,
  If,
  Fn,
  instanceIndex,
  vertexIndex,
  modelWorldMatrix,
} from "three/tsl";
import { useMainStore } from '@/stores';

const mainStore = useMainStore();
const tier = await mainStore.resolveGPUTier();

const getGrassCountSize = () => {
  switch (tier.tier) {
    case 0:
      return 3000;
    case 1:
    case 2:
      return 3500;
    case 3:
      return 4500;
    default:
      return 6000;
  }
};

const getGrassSegments = () => {
  switch (tier.tier) {
    case 0:
      return 6;
    case 1:
    case 2:
      return 8;
    case 3:
      return 12;
    default:
      return 16;
  }
};


const options = reactive({
  // grass
  grassSpeed: 0.5,
  grassMovement: 6,
  visible: true,
  grassHeight: 12,
  grassWidth: 0.75,
  // Canopy occlusion: how dark the blade goes at the root, and how far up the
  // blade the recovery to full light takes. aoHeight looks far too high until you
  // notice this mesh sits at y = -5 while Floor.vue's plane is at y = -2: the
  // bottom quarter of every blade is under the floor and never drawn. A curve that
  // finishes by 0.45 has already spent most of itself out of sight.
  aoFloor: 0.05,
  aoHeight: 0.8,
  // Wind, ported from the simon-grass demo. windScale is the one that decides
  // whether the field moves as one body: it is the spatial frequency of the noise,
  // so it sets how far apart two blades have to be before they disagree about the
  // wind. At 0.5 every blade sampled somewhere different and the field shimmered;
  // at 0.05 a whole stand shares a value and leans together.
  windScale: 0.05,
  windLean: 0.5,
  leanSpread: 1.25,
  // A prevailing wind: bias is the steady push, gust is how much the noise varies
  // it. Keeping bias > gust means the strength breathes but never reverses, so the
  // field always lies the same way instead of flapping back and forth.
  windBias: 0.45,
  windGust: 1.1,
  // Radians. 0 pushes along -Z (away from camera), PI/2 pushes along +X (right).
  windDirection: Math.PI * 0.5,
  // World units/sec that the gust fronts sweep along that direction.
  windTravel: 2.5,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const store = usePaneStore();
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Grass", expanded: false });
  folder.addBinding(options, "visible");
  folder.addBinding(options, "grassSpeed", { min: 0, max: 2, step: 0.01 });
  folder.addBinding(options, "grassMovement", { min: 0, max: 20, step: 0.1 });
  folder.addBinding(options, "grassHeight", { min: 1, max: 25, step: 0.5 });
  folder.addBinding(options, "grassWidth", { min: 0.05, max: 1, step: 0.01 });

  const aoFolder = folder.addFolder({ title: "Canopy AO" });
  aoFolder.addBinding(options, "aoFloor", { min: 0, max: 1, step: 0.01 });
  aoFolder.addBinding(options, "aoHeight", { min: 0.01, max: 1, step: 0.01 });

  const windFolder = folder.addFolder({ title: "Wind" });
  // Low = the field moves as one, high = every blade for itself.
  windFolder.addBinding(options, "windScale", { min: 0.005, max: 0.6, step: 0.005 });
  windFolder.addBinding(options, "windLean", { min: 0, max: 5, step: 0.05 });
  windFolder.addBinding(options, "windBias", { min: -1, max: 2, step: 0.01 });
  windFolder.addBinding(options, "windGust", { min: 0, max: 2, step: 0.01 });
  windFolder.addBinding(options, "windDirection", { min: 0, max: Math.PI * 2, step: 0.01 });
  windFolder.addBinding(options, "windTravel", { min: 0, max: 20, step: 0.1 });
  windFolder.addBinding(options, "leanSpread", { min: 0, max: 2, step: 0.01 });
});

const NUM_GRASS = getGrassCountSize();
const GRASS_SEGMENTS = getGrassSegments();
const GRASS_PATCH_SIZE = 10;
// The patch is stretched along Z so a shallow field of blades covers the whole corridor
// the camera looks down. positionNode below reads the same constant.
const GRASS_FORWARD_SCALE = 10;

const VERTICES = (GRASS_SEGMENTS + 1) * 2;
const indices = [];

for (let i = 0; i < GRASS_SEGMENTS; i++) {
  const vi = i + 2;
  indices[i * 12 + 0] = vi + 0;
  indices[i * 12 + 1] = vi + 1;
  indices[i * 12 + 2] = vi + 2;

  indices[i * 12 + 3] = vi + 2;
  indices[i * 12 + 4] = vi + 1;
  indices[i * 12 + 5] = vi + 3;

  const fi = VERTICES + vi;

  indices[i * 12 + 6] = fi + 2;
  indices[i * 12 + 7] = fi + 1;
  indices[i * 12 + 8] = fi + 0;

  indices[i * 12 + 9] = fi + 3;
  indices[i * 12 + 10] = fi + 1;
  indices[i * 12 + 11] = fi + 2;
}
const geo = new InstancedBufferGeometry();
geo.instanceCount = NUM_GRASS;
geo.setIndex(indices);
geo.setAttribute(
  "position",
  new BufferAttribute(new Float32Array(VERTICES * 2 * 3), 3)
);
// Blades reach GRASS_PATCH_SIZE in x, GRASS_PATCH_SIZE * GRASS_FORWARD_SCALE in z, and
// stand grassHeight tall. The old radius of 21 only ever covered the x spread, which left
// the mesh cullable while most of its blades were still on screen. 25 is the pane maximum
// for grassHeight, so this stays valid across the whole slider range without tracking it.
geo.boundingSphere = new Sphere(
  new Vector3(0, 0, 0),
  Math.hypot(GRASS_PATCH_SIZE, 25, GRASS_PATCH_SIZE * GRASS_FORWARD_SCALE) + 1
);

const material = new MeshStandardNodeMaterial();
material.transparent = true;
material.depthWrite = true;
material.lights = true;

const uTime = uniform(0);
const uTimeMove = uniform(0);
const uGrassParams = uniform(
  new Vector4(GRASS_SEGMENTS, GRASS_PATCH_SIZE, options.grassWidth, options.grassHeight)
);

// x = root brightness, y = height fraction over which light recovers.
const uGrassAO = uniform(new Vector2(options.aoFloor, options.aoHeight));

// x = noise spatial scale, y = lean strength, z = per-blade lean spread,
// w = how fast gust fronts sweep along the wind direction.
const uWind = uniform(
  new Vector4(options.windScale, options.windLean, options.leanSpread, options.windTravel)
);
// x = steady push, y = gust variation, z = direction in radians.
const uWindMix = uniform(
  new Vector3(options.windBias, options.windGust, options.windDirection)
);
const uWindTime = uniform(0);

const vGrassData = varying(vec4(), "vGrassData");
const vNormal = varying(vec3(), "vNormal");

const inverseLerp = Fn(([v, minValue, maxValue]) => {
  return v.sub(minValue).div(maxValue.sub(minValue));
});

const remap = Fn(([v, inMin, inMax, outMin, outMax]) => {
  const t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
});

const murmurHash21 = Fn(([src]) => {
  const M = uint(0x5bd1e995);
  const h0 = uvec2(uint(1190494759), uint(2147483647));
  let s = src.mul(M);
  s = bitXor(s, shiftRight(s, uint(24)));
  s = s.mul(M);

  let h = h0.mul(M);
  h = bitXor(h, uvec2(s, s));
  h = bitXor(h, shiftRight(h, uvec2(uint(13), uint(13))));
  h = h.mul(M);
  h = bitXor(h, shiftRight(h, uvec2(uint(15), uint(15))));
  return h;
});

const hash = Fn(([p]) => {
  const p1 = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );

  return fract(sin(p1).mul(43758.5453123)).mul(2.0).sub(1.0);
});

const hash21 = Fn(([src]) => {
  const h = murmurHash21(floatBitsToUint(src));
  const mask = uvec2(uint(0x007fffff), uint(0x007fffff));
  const one = uvec2(uint(0x3f800000), uint(0x3f800000));
  const bits = bitOr(bitAnd(h, mask), one);
  return uintBitsToFloat(bits).sub(1.0);
});

const noise = Fn(([p]) => {
  const i = floor(p);
  const f = fract(p);
  const u = f.mul(f).mul(vec3(3.0).sub(f.mul(2.0)));

  const v000 = dot(hash(i.add(vec3(0.0, 0.0, 0.0))), f.sub(vec3(0.0, 0.0, 0.0)));
  const v100 = dot(hash(i.add(vec3(1.0, 0.0, 0.0))), f.sub(vec3(1.0, 0.0, 0.0)));
  const v010 = dot(hash(i.add(vec3(0.0, 1.0, 0.0))), f.sub(vec3(0.0, 1.0, 0.0)));
  const v110 = dot(hash(i.add(vec3(1.0, 1.0, 0.0))), f.sub(vec3(1.0, 1.0, 0.0)));
  const v001 = dot(hash(i.add(vec3(0.0, 0.0, 1.0))), f.sub(vec3(0.0, 0.0, 1.0)));
  const v101 = dot(hash(i.add(vec3(1.0, 0.0, 1.0))), f.sub(vec3(1.0, 0.0, 1.0)));
  const v011 = dot(hash(i.add(vec3(0.0, 1.0, 1.0))), f.sub(vec3(0.0, 1.0, 1.0)));
  const v111 = dot(hash(i.add(vec3(1.0, 1.0, 1.0))), f.sub(vec3(1.0, 1.0, 1.0)));

  const x00 = mix(v000, v100, u.x);
  const x10 = mix(v010, v110, u.x);
  const x01 = mix(v001, v101, u.x);
  const x11 = mix(v011, v111, u.x);
  const y0 = mix(x00, x10, u.y);
  const y1 = mix(x01, x11, u.y);

  return mix(y0, y1, u.z);
});

const easeOut = Fn(([x, t]) => {
  return vec2(1.0, 0.0).x.sub(pow(vec2(1.0, 0.0).x.sub(x), t));
});

const rotateY = Fn(([theta]) => {
  const c = cos(theta);
  const s = sin(theta);
  return mat3(vec3(c, 0.0, s), vec3(0.0, 1.0, 0.0), vec3(s.negate(), 0.0, c));
});

const rotateAxis = Fn(([axis, angle]) => {
  const s = sin(angle);
  const c = cos(angle);
  const oc = vec2(1.0, 0.0).x.sub(c);

  return mat3(
    vec3(
      oc.mul(axis.x).mul(axis.x).add(c),
      oc.mul(axis.x).mul(axis.y).sub(axis.z.mul(s)),
      oc.mul(axis.z).mul(axis.x).add(axis.y.mul(s))
    ),
    vec3(
      oc.mul(axis.x).mul(axis.y).add(axis.z.mul(s)),
      oc.mul(axis.y).mul(axis.y).add(c),
      oc.mul(axis.y).mul(axis.z).sub(axis.x.mul(s))
    ),
    vec3(
      oc.mul(axis.z).mul(axis.x).sub(axis.y.mul(s)),
      oc.mul(axis.y).mul(axis.z).add(axis.x.mul(s)),
      oc.mul(axis.z).mul(axis.z).add(c)
    )
  );
});

const bezier = Fn(([P0, P1, P2, P3, t]) => {
  const one = vec2(1.0, 0.0).x;
  const omt = one.sub(t);
  return P0.mul(omt.mul(omt).mul(omt))
    .add(P1.mul(3.0).mul(omt.mul(omt)).mul(t))
    .add(P2.mul(3.0).mul(omt).mul(t.mul(t)))
    .add(P3.mul(t.mul(t).mul(t)));
});


material.positionNode = Fn(() => {
  const PI = vec2(3.14159, 0.0).x;
  const grassSegments = uGrassParams.x;
  const grassVertices = grassSegments.add(1.0).mul(2.0);
  const grassPatchSize = uGrassParams.y;
  const grassWidth = uGrassParams.z;
  const grassHeight = uGrassParams.w;

  const hashedInstanceID = hash21(instanceIndex.toFloat()).mul(2.0).sub(1.0);
  const forwardScale = vec2(GRASS_FORWARD_SCALE, 0.0).x;
  const grassOffset = vec3(
    hashedInstanceID.x,
    0.0,
    hashedInstanceID.y.mul(forwardScale)
  ).mul(grassPatchSize);

  const grassBladeWorldPos = modelWorldMatrix.mul(vec4(grassOffset, 1.0)).xyz;
  const hashVal = hash(grassBladeWorldPos);

  // Hoisted: the wind below needs to know where this blade actually stands, not
  // just which instance it is. Both grass meshes sit at z = 0, so the wrap applied
  // to the local offset lands on the same number in world space.
  const range = grassPatchSize.mul(forwardScale).mul(2.0);
  const halfRange = range.mul(0.5);
  const scrollSpeed = vec2(2.0, 0.0).x;
  const bladeWrappedZ = mod(
    grassBladeWorldPos.z.add(uTimeMove.mul(scrollSpeed)).add(halfRange), range
  ).sub(halfRange);

  const angle = remap(hashVal.x, -1.0, 1.0, PI.negate(), PI);

  const vertFB_ID = mod(vertexIndex.toFloat(), grassVertices.mul(2.0));
  const vertID = mod(vertFB_ID, grassVertices);

  const xSide = mod(vertID, 2.0);
  const heightPercent = vertID.sub(xSide).div(grassSegments.mul(2.0));

  const width = grassWidth.mul(easeOut(vec2(1.0, 0.0).x.sub(heightPercent), 0.5));
  const heightJitter = remap(hashVal.z, -1.0, 1.0, 0.8, 1.2);
  const height = grassHeight.mul(heightJitter);

  const x = xSide.sub(0.5).mul(width);
  let y = heightPercent.mul(height);
  let z = vec2(0.0, 0.0).x;

  const stiffness = vec2(1.0, 0.0).x;

  // Sampled at where the blade actually stands (bladeWrappedZ), not at its fixed
  // instance offset. Sampling the offset glued each blade's wind value to the blade,
  // so the pattern could only ever be dragged toward the camera at the scroll speed.
  // Anchoring it to the corridor instead lets the grass travel through the wind, and
  // lets the gusts move on their own terms.
  const windAngle = uWindMix.z;
  // rotateAxis about this axis by a positive angle tilts toward pushDir: axis X
  // (angle 0) leans -Z, axis Z (angle PI/2) leans +X.
  const windAxis = vec3(cos(windAngle), 0.0, sin(windAngle));
  const pushDir = vec2(sin(windAngle), cos(windAngle).negate());

  // Subtracting the travel offset marches the fronts along pushDir, so they sweep
  // the way the wind is actually blowing. The third noise coord is time, so the
  // gusts also change shape instead of sliding across as rigid blobs.
  const windSample = vec2(grassBladeWorldPos.x, bladeWrappedZ)
    .sub(pushDir.mul(uWind.w.mul(uWindTime)))
    .mul(uWind.x);
  const windStrength = noise(vec3(windSample, uTime)).mul(uWindMix.y).add(uWindMix.x);

  const windLeanAngle = windStrength.mul(uWind.y).mul(heightPercent).mul(stiffness);

  const randomLeanAnimation = noise(vec3(grassBladeWorldPos.xz, uTime.mul(4.0))).mul(
    windStrength.add(0.125)
  );
  const leanFactor = remap(hashVal.y, -1.0, 1.0, uWind.z.negate(), uWind.z).add(
    randomLeanAnimation
  );

  const p1 = vec3(0.0);
  const p2 = vec3(0.0, 0.33, 0.0);
  const p3 = vec3(0.0, 0.66, 0.0);
  const p4 = vec3(0.0, cos(leanFactor), sin(leanFactor));
  const curve = bezier(p1, p2, p3, p4, heightPercent);

  y = curve.y.mul(height);
  z = curve.z.mul(height);

  const grassMat = rotateAxis(windAxis, windLeanAngle).mul(rotateY(angle));
  const grassLocalPosition = grassMat.mul(vec3(x, y, z)).add(grassOffset);

  const scrolledZ = grassLocalPosition.z.add(uTimeMove.mul(scrollSpeed));
  const wrappedZ = mod(scrolledZ.add(halfRange), range).sub(halfRange);
  const wrappedPosition = vec3(grassLocalPosition.x, grassLocalPosition.y, wrappedZ);

  const fadeMargin = halfRange.mul(0.55);
  const distFromEdge = halfRange.sub(abs(wrappedZ));
  const edgeFade = smoothstep(0.0, fadeMargin, distFromEdge);

  vNormal.assign(normalize(grassMat.mul(vec3(0.0, 1.0, 0.0))));
  vGrassData.assign(vec4(xSide.sub(0.5), heightPercent, xSide, edgeFade));

  return wrappedPosition;
})();

material.colorNode = Fn(() => {
  const grassX = vGrassData.x;
  const heightPercent = vGrassData.y;
  const gray = mix(vec3(0.15), vec3(0.50), heightPercent.mul(0.5));
  const baseColour = mix(gray.mul(1.3), gray, smoothstep(0.5, 0.0, abs(grassX)));
  const alpha = vGrassData.w;
  If(alpha.lessThan(0.01), () => {
    Discard();
  });

  // In a dense sward the blades occlude each other long before ground level, so
  // hardly any skylight reaches the root. The gradient above only shifts value
  // across the blade, which left every blade evenly lit root to tip and made the
  // whole field read as one flat wall rather than something with depth in it.
  const canopyAO = mix(uGrassAO.x, 1.0, smoothstep(0.0, uGrassAO.y, heightPercent));

  return vec4(baseColour.mul(canopyAO), alpha);
})();

material.normalNode = normalize(vNormal);

uGrassParams.value.set(GRASS_SEGMENTS, GRASS_PATCH_SIZE, options.grassWidth, options.grassHeight);

watch(() => [options.grassWidth, options.grassHeight], () => {
  uGrassParams.value.set(GRASS_SEGMENTS, GRASS_PATCH_SIZE, options.grassWidth, options.grassHeight);
});

watch(() => [options.aoFloor, options.aoHeight], () => {
  uGrassAO.value.set(options.aoFloor, options.aoHeight);
});

watch(
  () => [options.windScale, options.windLean, options.leanSpread, options.windTravel],
  () => {
    uWind.value.set(
      options.windScale, options.windLean, options.leanSpread, options.windTravel
    );
  }
);

watch(
  () => [options.windBias, options.windGust, options.windDirection],
  () => {
    uWindMix.value.set(options.windBias, options.windGust, options.windDirection);
  }
);

onUnmounted(() => {
  geo.dispose();
  material.dispose();
});

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  // Frozen at the uniforms' initial 0, which is a valid static grass field.
  if (mainStore.reducedMotion) return;
  uTime.value = elapsed * options.grassSpeed;
  uTimeMove.value = elapsed * options.grassMovement;
  uWindTime.value = elapsed;
});
</script>
<template>
  <TresMesh :geometry="geo" :position="[14.5, -5, 0]" :material :visible="options.visible" />
  <TresMesh :geometry="geo" :position="[-14.5, -5, 0]" :material :visible="options.visible" />
</template>
