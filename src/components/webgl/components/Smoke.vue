<script setup>
import { shallowRef, watch, reactive } from "vue";
import { useLoop, useTresContext, useTexture } from "@tresjs/core";
import {
  DataTexture,
  RepeatWrapping,
  NearestFilter,
  GLSL3,
  BackSide,
  Data3DTexture,
  RedFormat,
  LinearFilter,
  WebGLRenderTarget,
  DepthTexture,
  DepthFormat,
  UnsignedShortType,
  Vector3,
  Vector2,
  Color,
  Matrix4
} from "three";
import { VolumetricMaskController } from "../utils/SmokeUtils";
import VERTEX_SHADER from "../shaders/smoke/vertex.glsl";
import FRAGMENT_SHADER from "../shaders/smoke/fragment.glsl";
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "@/stores";

const parameters = reactive({
  // Texture Generation
  textureSize: 128,
  cloudCoverage: 0.55,
  cloudSoftness: 0.05,
  noiseScale: 3.5,
  octaves: 5,
  persistence: 0.5,
  lacunarity: 3.0,
  noiseIntensity: 1.0,
  seed: Math.random() * 1000.0,

  // Cloud Shape (Shader)
  textureTiling: 2.0,

  // Material & Rendering (Shader)
  densityThreshold: 0.1,
  densityMultiplier: 3.0,
  opacity: 3.0,
  raymarchSteps: 44,
  lightSteps: 1,

  // Scale & Animation
  containerScale: 128.0,
  animationSpeedX: 0.02,
  animationSpeedY: 0.0,
  animationSpeedZ: -0.25,
  isAnimating: true,

  // Lighting
  ambientLightIntensity: 0.75,
  directionalLightIntensity: 0,
  // Depth / Occlusion stabilization
  depthBias: 0.5,            // Base bias (world units in view depth space approximation)
  autoDepthBias: true,       // Enable adaptive biasing
  minDepthBias: 0.15,        // Clamp lower bound (avoid precision acne)
  maxDepthBias: 1.25,        // Clamp upper bound (avoid halos)
  motionBiasScale: 0.35,     // How strongly camera motion influences bias
});

// ------- Refs & Context -------
const { width, height } = useWindowSize();
const { camera, renderer, scene } = useTresContext();
const directionalLightRef = shallowRef();
const smokeRef = shallowRef();
const store = useMainStore();

// A tiny 1x1 fallback texture for unused sampler uniforms
const fallbackTexture = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
fallbackTexture.needsUpdate = true;

// Use a blue-noise-like texture (we reuse an available asset for jitter)
const { map: blueNoise } = await useTexture({ map: "/textures/Cloud.png" });

blueNoise.wrapS = RepeatWrapping;
blueNoise.wrapT = RepeatWrapping;
blueNoise.minFilter = NearestFilter;
blueNoise.magFilter = NearestFilter;
blueNoise.needsUpdate = true;

// Mask controller creates u_mask_* uniforms and 3D shape noise textures
const maskController = new VolumetricMaskController();

// ------- Shader Material -------
const shader = {
  uniforms: {
    ...maskController.uniforms,
    uVolumeTexture: { value: null },
    uTextureOffset: { value: new Vector3(0, 0, 0) },
    uTextureTiling: { value: parameters.textureTiling },
    uBlueNoise: { value: null },
    uBlueNoiseSize: {
      value: new Vector2(32, 32),
    },
    uResolution: { value: new Vector2(width.value, height.value) },
    cameraPos: { value: camera.value.position },
    uSunColor: { value: new Color(0xffffff) },
    uSunIntensity: { value: parameters.directionalLightIntensity },
    uLightDir: { value: new Vector3(0, 5, 25).normalize() },
    uAmbientColor: { value: new Color(0xb8cde0) },
    uAmbientIntensity: { value: parameters.ambientLightIntensity },
    uOpacity: { value: parameters.opacity },
    uMaxSteps: { value: parameters.raymarchSteps },
    uLightSteps: { value: parameters.lightSteps },
    uDensityThreshold: { value: parameters.densityThreshold },
    uDensityMultiplier: { value: parameters.densityMultiplier },
    uDepthTexture: { value: fallbackTexture },
    uProjectionMatrixInverse: { value: camera.value.projectionMatrixInverse },
    // We keep the inverse (camera.matrixWorld) but also send the actual viewMatrix to avoid per-fragment inversion cost
    uViewMatrixInverse: { value: camera.value.matrixWorld },
    uViewMatrix: { value: camera.value.matrixWorldInverse },
    uModelMatrix: { value: new Matrix4() },
    uContainerScale: { value: parameters.containerScale },
    uProjectionMatrix: { value: camera.value.projectionMatrix },
    uCameraNear: { value: camera.value.near },
    uCameraFar: { value: camera.value.far },
    uOcclusionMode: { value: false },
    uDepthBias: { value: 0.5 }, // world-space bias to reduce popping holes when geometry moves
  },
  vertexShader: VERTEX_SHADER,
  fragmentShader: FRAGMENT_SHADER,
  glslVersion: GLSL3,
  side: BackSide,
  transparent: true,
  depthWrite: false,
  depthTest: false,
};

shader.uniforms.uBlueNoise.value = blueNoise;
shader.uniforms.uBlueNoiseSize.value.x = blueNoise.width;
shader.uniforms.uBlueNoiseSize.value.y = blueNoise.height;

// WEB WORKER

const parametersClone = { ...parameters };
const myWorker = new Worker(new URL("SmokeWorker.js", import.meta.url));
myWorker.postMessage(parametersClone);
myWorker.onmessage = (e) => {
  const size = parameters.textureSize;
  const texture = new Data3DTexture(e.data, size, size, size);
  texture.format = RedFormat;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.unpackAlignment = 1;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.wrapR = RepeatWrapping;
  texture.needsUpdate = true;
  store.finishLoading = true;
  set3DTexture(texture);
};

const set3DTexture = (texture) => {
  shader.uniforms.uVolumeTexture.value = texture;
};

// Create a depth render target for occlusion
let depthTarget = new WebGLRenderTarget(width.value, height.value);
depthTarget.depthTexture = new DepthTexture(width.value, height.value);
depthTarget.depthTexture.format = DepthFormat;
depthTarget.depthTexture.type = UnsignedShortType;
depthTarget.depthBuffer = true;
shader.uniforms.uDepthTexture.value = depthTarget.depthTexture;

// Animate offsets + update matrices and light dir
const animatedOffset = new Vector3();
// For adaptive depth bias
const lastCameraPos = new Vector3().copy(camera.value.position);
let smoothedMotion = 0.0;
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  // matrices and camera
  shader.uniforms.uProjectionMatrixInverse.value.copy(
    camera.value.projectionMatrixInverse
  );
  shader.uniforms.uViewMatrixInverse.value.copy(camera.value.matrixWorld);
  shader.uniforms.uViewMatrix.value.copy(camera.value.matrixWorldInverse);
  if (smokeRef.value) {
    shader.uniforms.uModelMatrix.value.copy(smokeRef.value.matrixWorld);
  }
  shader.uniforms.uProjectionMatrix.value.copy(camera.value.projectionMatrix);
  shader.uniforms.cameraPos.value.copy(camera.value.position);

  // Adaptive depth bias to reduce temporal holes when either camera or scene is moving fast.
  if (parameters.autoDepthBias) {
    const camMotion = camera.value.position.distanceTo(lastCameraPos);
    lastCameraPos.copy(camera.value.position);
    // Exponential smoothing to avoid flicker
    const smoothing = 0.85;
    smoothedMotion = smoothedMotion * smoothing + camMotion * (1.0 - smoothing);
    // Derive dynamic bias: base + scaled motion
    const dynamicBias = parameters.depthBias + smoothedMotion * parameters.motionBiasScale * (delta || 0.016) * 60.0; // normalize by ~60fps
    const clamped = Math.min(Math.max(dynamicBias, parameters.minDepthBias), parameters.maxDepthBias);
    shader.uniforms.uDepthBias.value = clamped;
  } else {
    // Manual mode
    shader.uniforms.uDepthBias.value = parameters.depthBias;
  }

  // light direction as normalized vector
  if (directionalLightRef.value?.position) {
    shader.uniforms.uLightDir.value.copy(
      directionalLightRef.value.position.clone().normalize()
    );
  }

  const dt = delta ?? 0.016;
  animatedOffset.x += parameters.animationSpeedX * dt;
  animatedOffset.y += parameters.animationSpeedY * dt;
  animatedOffset.z += parameters.animationSpeedZ * dt;
  shader.uniforms.uTextureOffset.value.copy(animatedOffset);

  // Depth pre-pass: render scene without the volumetric mesh into the depth target
  if (renderer.value && scene?.value && smokeRef.value) {
    const r = renderer.value; // in v5 isn't .value
    const s = scene.value;
    const prevTarget = r.getRenderTarget();
    const prevAutoClear = r.autoClear;
    const prevVisible = smokeRef.value.visible;
    // Hide the volume for depth pre-pass
    smokeRef.value.visible = false;
    r.setRenderTarget(depthTarget);
    r.autoClear = true;
    r.clear(true, true, true);
    r.render(s, camera.value);
    // Restore
    smokeRef.value.visible = prevVisible;
    r.setRenderTarget(prevTarget);
    r.autoClear = prevAutoClear;
    // Provide the freshly rendered depth texture to the shader
    shader.uniforms.uDepthTexture.value = depthTarget.depthTexture;
  }
});

// Keep resolution uniform in sync
watch([width, height], ([w, h]) => {
  shader.uniforms.uResolution.value.set(w, h);
  // Resize the depth render target to match the canvas size
  if (depthTarget) {
    depthTarget.setSize(w, h);
  }
});

// React to manual depthBias changes when auto is off
watch(
  () => [parameters.depthBias, parameters.autoDepthBias],
  () => {
    if (!parameters.autoDepthBias) {
      shader.uniforms.uDepthBias.value = parameters.depthBias;
    }
  }
);
</script>

<template>
  <!-- Lights -->
  <TresDirectionalLight
    ref="directionalLightRef"
    :args="[0xffffff, parameters.directionalLightIntensity]"
    :position="[1, 1, 1]"
    cast-shadow
    :shadow-camera-near="0.5"
    :shadow-camera-far="500"
    :shadow-camera-left="-50"
    :shadow-camera-right="50"
    :shadow-camera-top="50"
    :shadow-camera-bottom="-50"
    :shadow-mapSize="[2048, 2048]"
  />

  <!-- Volumetric Cloud Container (unit cube scaled up) -->
  <TresMesh ref="smokeRef" :scale="parameters.containerScale">
    <TresBoxGeometry :args="[1, 1, 1]" />
    <TresShaderMaterial v-bind="shader" />
  </TresMesh>
</template>
