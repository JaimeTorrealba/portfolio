<script setup>
import { reactive, onMounted } from "vue";
import { BufferAttribute, InstancedBufferGeometry, Sphere, Vector3, Vector4 } from "three";
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

const store = usePaneStore();

const options = reactive({
  // grass
  grassSpeed: 0.3,
  grassMovement: 6,
  visible: true,
  grassHeight: 10,
  grassWidth: 0.25,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Grass" });
  folder.addBinding(options, "visible");
  folder.addBinding(options, "grassSpeed", { min: 0, max: 2, step: 0.01 });
  folder.addBinding(options, "grassMovement", { min: 0, max: 20, step: 0.1 });
  folder.addBinding(options, "grassHeight", { min: 1, max: 25, step: 0.5 });
  folder.addBinding(options, "grassWidth", { min: 0.05, max: 1, step: 0.01 });
});

const NUM_GRASS = 30000;
const GRASS_SEGMENTS = 10;
const GRASS_PATCH_SIZE = 15;

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
geo.boundingSphere = new Sphere(new Vector3(0, 0, 0), 1 + GRASS_PATCH_SIZE * 2);

const material = new MeshStandardNodeMaterial();
material.transparent = true;
material.depthWrite = true;
material.lights = true;

const uTime = uniform(0);
const uTimeMove = uniform(0);
const uGrassParams = uniform(
  new Vector4(GRASS_SEGMENTS, GRASS_PATCH_SIZE, options.grassWidth, options.grassHeight)
);

const vColour = varying(vec3(), "vColour");
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

const TIP_COLOUR = vec3(0.27, 0.24, 0.15);
const BASE_COLOUR = vec3(0.14, 0.11, 0.04);

material.positionNode = Fn(() => {
  const PI = vec2(3.14159, 0.0).x;
  const grassSegments = uGrassParams.x;
  const grassVertices = grassSegments.add(1.0).mul(2.0);
  const grassPatchSize = uGrassParams.y;
  const grassWidth = uGrassParams.z;
  const grassHeight = uGrassParams.w;

  const hashedInstanceID = hash21(instanceIndex.toFloat()).mul(2.0).sub(1.0);
  const forwardScale = vec2(10.0, 0.0).x;
  const grassOffset = vec3(
    hashedInstanceID.x,
    0.0,
    hashedInstanceID.y.mul(forwardScale)
  ).mul(grassPatchSize);

  const grassBladeWorldPos = modelWorldMatrix.mul(vec4(grassOffset, 1.0)).xyz;
  const hashVal = hash(grassBladeWorldPos);

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
  const windStrength = noise(vec3(grassBladeWorldPos.xz.mul(0.5), 0.0).add(uTime));
  const windAngle = vec2(0.0, 0.0).x;
  const windAxis = vec3(cos(windAngle), 0.0, sin(windAngle));
  const windLeanAngle = windStrength.mul(2.25).mul(heightPercent).mul(stiffness);

  const randomLeanAnimation = noise(vec3(grassBladeWorldPos.xz, uTime.mul(4.0))).mul(
    windStrength.add(0.125)
  );
  const leanFactor = remap(hashVal.y, -1.0, 1.0, -0.7, 0.7).add(randomLeanAnimation.mul(1.35));

  const p1 = vec3(0.0);
  const p2 = vec3(0.0, 0.33, 0.0);
  const p3 = vec3(0.0, 0.66, 0.0);
  const p4 = vec3(0.0, cos(leanFactor), sin(leanFactor));
  const curve = bezier(p1, p2, p3, p4, heightPercent);

  y = curve.y.mul(height);
  z = curve.z.mul(height);

  const grassMat = rotateAxis(windAxis, windLeanAngle).mul(rotateY(angle));
  const grassLocalPosition = grassMat.mul(vec3(x, y, z)).add(grassOffset);

  const range = grassPatchSize.mul(forwardScale).mul(2.0);
  const halfRange = range.mul(0.5);
  const scrollSpeed = vec2(2.0, 0.0).x;

  const scrolledZ = grassLocalPosition.z.add(uTimeMove.mul(scrollSpeed));
  const wrappedZ = mod(scrolledZ.add(halfRange), range).sub(halfRange);
  const wrappedPosition = vec3(grassLocalPosition.x, grassLocalPosition.y, wrappedZ);

  const fadeMargin = halfRange.mul(0.55);
  const distFromEdge = halfRange.sub(abs(wrappedZ));
  const edgeFade = smoothstep(0.0, fadeMargin, distFromEdge);

  const colour = mix(BASE_COLOUR, TIP_COLOUR, heightPercent.mul(0.5));
  vColour.assign(mix(vec3(1.0, 0.0, 0.0), colour, stiffness));
  vNormal.assign(normalize(grassMat.mul(vec3(0.0, 1.0, 0.0))));
  vGrassData.assign(vec4(x, heightPercent, xSide, edgeFade));

  return wrappedPosition;
})();

material.colorNode = Fn(() => {
  const grassX = vGrassData.x;
  const baseColour = mix(
    vColour.mul(2.0),
    vColour,
    smoothstep(0.125, 0.0, abs(grassX))
  );
  const alpha = vGrassData.w;
  If(alpha.lessThan(0.01), () => {
    Discard();
  });

  return vec4(baseColour, alpha);
})();

material.normalNode = normalize(vNormal);

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  uTime.value = elapsed * options.grassSpeed;
  uTimeMove.value = elapsed * options.grassMovement;
  uGrassParams.value.set(
    GRASS_SEGMENTS,
    GRASS_PATCH_SIZE,
    options.grassWidth,
    options.grassHeight
  );
});
</script>
<template>
  <TresMesh :geometry="geo" :position="[20, -5, 0]" :material :visible="options.visible" />
  <TresMesh :geometry="geo" :position="[-20, -5, 0]" :material :visible="options.visible" />
</template>
