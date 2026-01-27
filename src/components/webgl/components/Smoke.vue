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
import { Pane } from "tweakpane";

const parameters = reactive({
  // Texture Generation
  textureSize: 64,
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
  ambientLightIntensity: 1.75,
  directionalLightIntensity: 1,
  // Debug / Features
  useDepthOcclusion: false, // set to true to re-enable depth based occlusion
});

const pane = new Pane({ title: "Volumetric Smoke" });
const folderGen = pane.addFolder({ title: "Texture Generation" });
folderGen.addBinding(parameters, "cloudCoverage", { min: 0, max: 1, step: 0.01 });
folderGen.addBinding(parameters, "cloudSoftness", { min: 0.01, max: 0.2, step: 0.01 });
folderGen.addBinding(parameters, "noiseScale", { min: 0.1, max: 10, step: 0.1 });
folderGen.addBinding(parameters, "octaves", { min: 1, max: 8, step: 1 });
folderGen.addBinding(parameters, "persistence", { min: 0.1, max: 1, step: 0.05 });
folderGen.addBinding(parameters, "lacunarity", { min: 1, max: 5, step: 0.1 });
folderGen.addBinding(parameters, "noiseIntensity", { min: 0.1, max: 5, step: 0.1 });
folderGen.addBinding(parameters, "seed", { min: 0, max: 1000, step: 1 });
const folderMat = pane.addFolder({ title: "Material & Rendering" });
folderMat.addBinding(parameters, "textureTiling", { min: 0.1, max: 10, step: 0.1 });
folderMat.addBinding(parameters, "densityThreshold", { min: 0.01, max: 1, step: 0.01 });
folderMat.addBinding(parameters, "densityMultiplier", { min: 0.1, max: 10, step: 0.1 });
folderMat.addBinding(parameters, "opacity", { min: 0.1, max: 10, step: 0.1 });
folderMat.addBinding(parameters, "raymarchSteps", { min: 10, max: 100, step: 1 });
folderMat.addBinding(parameters, "lightSteps", { min: 1, max: 10, step: 1 });
const folderAnim = pane.addFolder({ title: "Scale & Animation" });
folderAnim.addBinding(parameters, "containerScale", { min: 10, max: 300, step: 1 });
folderAnim.addBinding(parameters, "animationSpeedX", { min: -1, max: 1, step: 0.01 });
folderAnim.addBinding(parameters, "animationSpeedY", { min: -1, max: 1, step: 0.01 });
folderAnim.addBinding(parameters, "animationSpeedZ", { min: -1, max: 1, step: 0.01 });
const folderLight = pane.addFolder({ title: "Lighting" }); 
folderLight.addBinding(parameters, "ambientLightIntensity", { min: 0, max: 5, step: 0.1 });
folderLight.addBinding(parameters, "directionalLightIntensity", { min: 0, max: 5, step: 0.1 });


// ------- Refs & Context -------
const { width, height } = useWindowSize();
const { camera } = useTresContext();
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
    uUseDepthOcclusion: { value: parameters.useDepthOcclusion },
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
});

// Keep resolution uniform in sync
watch([width, height], ([w, h]) => {
  shader.uniforms.uResolution.value.set(w, h);
  // Resize the depth render target to match the canvas size
  if (depthTarget) {
    depthTarget.setSize(w, h);
  }
});
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
