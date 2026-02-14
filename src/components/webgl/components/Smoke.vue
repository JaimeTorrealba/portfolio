<script setup>
import { reactive, watch, onMounted, toRaw } from "vue";
import { useLoop } from "@tresjs/core";
import { useTexture } from "@tresjs/cientos";
import {
  DataTexture,
  RepeatWrapping,
  NearestFilter,
  BackSide,
  Data3DTexture,
  RedFormat,
  LinearFilter,
  Vector3,
  Vector2,
  Color,
} from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import {
  varying,
  uniform,
  vec2,
  vec3,
  vec4,
  float,
  int,
  Fn,
  Loop,
  If,
  Break,
  Discard,
  min,
  max,
  mix,
  smoothstep,
  dot,
  normalize,
  exp,
  pow,
  mod,
  texture,
  texture3D,
  PI,
  screenCoordinate,
  modelWorldMatrixInverse,
  cameraPosition,
  positionGeometry,
} from "three/tsl";
import { VolumetricMaskController } from "../../../utils/SmokeUtils";
import { useMainStore } from "@/stores";
import { usePaneStore } from "@/stores/pane";

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
  densityMultiplier: 1.1,
  opacity: 3.0,
  raymarchSteps: 44,
  lightSteps: 1,

  // Scale & Animation
  containerScale: 60.0,
  positionX: 0,
  positionY: 3,
  positionZ: 1,

  animationSpeedX: 0.02,
  animationSpeedY: 0.0,
  animationSpeedZ: -0.4,
  isAnimating: true,

  // Lighting
  ambientLightIntensity: 1.75,
  // Debug / Features
  useDepthOcclusion: false, // set to true to re-enable depth based occlusion
});

const paneStore = usePaneStore();
const store = useMainStore();

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = paneStore.pane;
  const folder = pane.addFolder({ title: "Volumetric Smoke", expanded: false });

  const folderGen = folder.addFolder({ title: "Texture Generation" });
  folderGen.addBinding(parameters, "cloudCoverage", { min: 0, max: 1, step: 0.01 });
  folderGen.addBinding(parameters, "cloudSoftness", { min: 0.01, max: 0.2, step: 0.01 });
  folderGen.addBinding(parameters, "noiseScale", { min: 0.1, max: 10, step: 0.1 });
  folderGen.addBinding(parameters, "octaves", { min: 1, max: 8, step: 1 });
  folderGen.addBinding(parameters, "persistence", { min: 0.1, max: 1, step: 0.05 });
  folderGen.addBinding(parameters, "lacunarity", { min: 1, max: 5, step: 0.1 });
  folderGen.addBinding(parameters, "noiseIntensity", { min: 0.1, max: 5, step: 0.1 });
  folderGen.addBinding(parameters, "seed", { min: 0, max: 1000, step: 1 });

  const folderMat = folder.addFolder({ title: "Material & Rendering" });
  folderMat.addBinding(parameters, "textureTiling", { min: 0.1, max: 10, step: 0.1 });
  folderMat.addBinding(parameters, "densityThreshold", { min: 0.01, max: 1, step: 0.01 });
  folderMat.addBinding(parameters, "densityMultiplier", { min: 0.1, max: 10, step: 0.1 });
  folderMat.addBinding(parameters, "opacity", { min: 0.1, max: 10, step: 0.1 });
  folderMat.addBinding(parameters, "raymarchSteps", { min: 10, max: 100, step: 1 });
  folderMat.addBinding(parameters, "lightSteps", { min: 1, max: 10, step: 1 });

  const folderAnim = folder.addFolder({ title: "Scale & Animation" });
  folderAnim.addBinding(parameters, "containerScale", { min: 10, max: 300, step: 1 });
  folderAnim.addBinding(parameters, "positionX", { min: -20, max: 20, step: 1 });
  folderAnim.addBinding(parameters, "positionY", { min: -20, max: 20, step: 1 });
  folderAnim.addBinding(parameters, "positionZ", { min: -20, max: 20, step: 1 });
  folderAnim.addBinding(parameters, "animationSpeedX", { min: -1, max: 1, step: 0.01 });
  folderAnim.addBinding(parameters, "animationSpeedY", { min: -1, max: 1, step: 0.01 });
  folderAnim.addBinding(parameters, "animationSpeedZ", { min: -1, max: 1, step: 0.01 });

  const folderLight = folder.addFolder({ title: "Lighting" });
  folderLight.addBinding(parameters, "ambientLightIntensity", {
    min: 0,
    max: 5,
    step: 0.1,
  });
});

// A tiny 1x1 fallback 2D texture for sampler uniforms
const fallbackBlueNoise = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
fallbackBlueNoise.needsUpdate = true;

// A tiny 1x1x1 fallback volume texture for sampler uniforms
const fallbackVolumeTexture = new Data3DTexture(new Uint8Array([0]), 1, 1, 1);
fallbackVolumeTexture.format = RedFormat;
fallbackVolumeTexture.minFilter = LinearFilter;
fallbackVolumeTexture.magFilter = LinearFilter;
fallbackVolumeTexture.unpackAlignment = 1;
fallbackVolumeTexture.needsUpdate = true;

// Use a blue-noise-like texture (we reuse an available asset for jitter)
const { state: blueNoise } = useTexture("/textures/Cloud.png");

watch(blueNoise, (tex) => {
  if (!tex) return;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.minFilter = NearestFilter;
  tex.magFilter = NearestFilter;
  tex.needsUpdate = true;
  blueNoiseTex.value = tex;
  if (tex.image?.width && tex.image?.height) {
    uBlueNoiseSize.value.set(tex.image.width, tex.image.height);
  }
});

// Mask controller creates u_mask_* uniforms and 3D shape noise textures
const maskController = new VolumetricMaskController();

// ------- TSL Material (WebGPU) -------
const material = new MeshBasicNodeMaterial();
material.transparent = true;
material.depthWrite = false;
material.depthTest = false;
material.side = BackSide;

const volumeTex = texture3D(fallbackVolumeTexture);
const uTextureOffset = uniform(new Vector3(0, 0, 0));
const uTextureTiling = uniform(parameters.textureTiling);
const uBlueNoiseSize = uniform(new Vector2(1, 1));
const uSunColor = uniform(new Color(0xd0d4d8));
const uSunIntensity = uniform(5);
const uLightDir = uniform(new Vector3(0, 5, 25).normalize());
const uAmbientColor = uniform(new Color(0xaeb3b8));
const uAmbientIntensity = uniform(parameters.ambientLightIntensity);
const uOpacity = uniform(parameters.opacity);
const uMaxSteps = uniform(parameters.raymarchSteps);
const uLightSteps = uniform(parameters.lightSteps);
const uDensityThreshold = uniform(parameters.densityThreshold);
const uDensityMultiplier = uniform(parameters.densityMultiplier);
const uMaskRaio = uniform(maskController.uniforms.u_mask_raio.value);
const uMaskAchatamentoCima = uniform(
  maskController.uniforms.u_mask_achatamentoCima.value
);
const uMaskAchatamentoBaixo = uniform(
  maskController.uniforms.u_mask_achatamentoBaixo.value
);
const uMaskAchatamentoXpos = uniform(
  maskController.uniforms.u_mask_achatamentoXpos.value
);
const uMaskAchatamentoXneg = uniform(
  maskController.uniforms.u_mask_achatamentoXneg.value
);
const uMaskAchatamentoZpos = uniform(
  maskController.uniforms.u_mask_achatamentoZpos.value
);
const uMaskAchatamentoZneg = uniform(
  maskController.uniforms.u_mask_achatamentoZneg.value
);
const uMaskSoftness = uniform(maskController.uniforms.u_mask_softness.value);
const uMaskForcaRuido = uniform(maskController.uniforms.u_mask_forcaRuido.value);
const maskNoiseTex = texture3D(
  maskController.uniforms.u_mask_noiseMap.value ?? fallbackVolumeTexture
);
const uMaskForcaRuidoDetalhe = uniform(
  maskController.uniforms.u_mask_forcaRuidoDetalhe.value
);
const maskNoiseDetailTex = texture3D(
  maskController.uniforms.u_mask_noiseDetailMap.value ?? fallbackVolumeTexture
);
const uMaskVisualize = uniform(maskController.uniforms.u_mask_visualize.value);

const blueNoiseTex = texture(fallbackBlueNoise);

const EXTINCTION_MULT = vec3(0.6, 0.65, 0.7);
const DUAL_LOBE_WEIGHT = float(0.8);

const hitBox = Fn(({ orig, dir }) => {
  const boxMin = vec3(-0.5);
  const boxMax = vec3(0.5);
  const invDir = dir.reciprocal();
  const tminTmp = boxMin.sub(orig).mul(invDir);
  const tmaxTmp = boxMax.sub(orig).mul(invDir);
  const tmin = min(tminTmp, tmaxTmp);
  const tmax = max(tminTmp, tmaxTmp);
  const t0 = max(tmin.x, max(tmin.y, tmin.z));
  const t1 = min(tmax.x, min(tmax.y, tmax.z));
  return vec2(t0, t1);
});

const getMaskSDF = Fn(({ p }) => {
  const q = vec3(p).toVar();
  q.y.divAssign(p.y.greaterThan(0.0).select(uMaskAchatamentoCima, uMaskAchatamentoBaixo));
  q.x.divAssign(p.x.greaterThan(0.0).select(uMaskAchatamentoXpos, uMaskAchatamentoXneg));
  q.z.divAssign(p.z.greaterThan(0.0).select(uMaskAchatamentoZpos, uMaskAchatamentoZneg));
  const dist = q.length();
  const dir = q.div(dist);
  const texCoord = dir.mul(uMaskRaio).mul(0.5).add(0.5);
  const n1 = maskNoiseTex.sample(texCoord).r.mul(2.0).sub(1.0);
  const n2 = maskNoiseDetailTex.sample(texCoord).r.mul(2.0).sub(1.0);
  const disp = n1.mul(uMaskForcaRuido).add(n2.mul(uMaskForcaRuidoDetalhe));
  const sdf = uMaskRaio.add(disp).sub(dist);
  return uMaskRaio.lessThanEqual(0.0).select(float(-1.0), sdf);
});

const getMaskFactor = Fn(({ p }) => {
  const sdf = getMaskSDF({ p });
  return smoothstep(0.0, uMaskSoftness, sdf);
});

const HenyeyGreenstein = Fn(({ g, mu }) => {
  const gg = g.mul(g);
  const denom = pow(float(1.0).add(gg).sub(float(2.0).mul(g).mul(mu)), 1.5);
  return float(1.0).div(float(4.0).mul(PI)).mul(float(1.0).sub(gg)).div(denom);
});

const PhaseFunction = Fn(({ g, costh }) => {
  const hgBack = HenyeyGreenstein({ g: g.negate(), mu: costh });
  const hgForward = HenyeyGreenstein({ g, mu: costh });
  return mix(hgBack, hgForward, DUAL_LOBE_WEIGHT);
});

const getDensity = Fn(({ p }) => {
  const mask = getMaskFactor({ p });
  const texCoord = p.add(0.5).mul(uTextureTiling).add(uTextureOffset);
  const d = volumeTex.sample(texCoord).r;
  const filtered = d.lessThan(uDensityThreshold).select(float(0.0), d);
  const base = uMaskVisualize.select(float(1.0), filtered);
  return base.mul(uDensityMultiplier).mul(mask);
});

const CalculateLightEnergy = Fn(({ samplePos, lightDir }) => {
  const stepLength = float(1.0).div(float(uLightSteps));
  const acc = float(0.0).toVar();

  Loop(int(uLightSteps), ({ i }) => {
    const stepT = float(i).add(0.5).mul(stepLength);
    const p = samplePos.add(lightDir.mul(stepT));
    const inside = p.x
      .greaterThan(-0.5)
      .and(p.x.lessThan(0.5))
      .and(p.y.greaterThan(-0.5))
      .and(p.y.lessThan(0.5))
      .and(p.z.greaterThan(-0.5))
      .and(p.z.lessThan(0.5));

    If(inside, () => {
      acc.addAssign(getDensity({ p }).mul(stepLength));
    });
  });

  return exp(acc.negate());
});

const vOrigin = varying(vec3(modelWorldMatrixInverse.mul(vec4(cameraPosition, 1.0))));
const vDirection = varying(positionGeometry.sub(vOrigin));

material.colorNode = Fn(() => {
  const rayDir = normalize(vDirection);
  const bounds = vec2(hitBox({ orig: vOrigin, dir: rayDir })).toVar();

  If(bounds.x.greaterThanEqual(bounds.y), () => {
    Discard();
  });

  bounds.assign(vec2(max(bounds.x, 0.0), bounds.y));

  const rayLength = bounds.y.sub(bounds.x).toVar();
  If(rayLength.lessThan(0.001), () => {
    Discard();
  });

  const stepSize = rayLength.div(float(uMaxSteps));
  const jitterUv = mod(screenCoordinate, uBlueNoiseSize).div(uBlueNoiseSize);
  const jitter = blueNoiseTex.sample(jitterUv).r;
  const p = vec3(vOrigin.add(bounds.x.add(jitter.mul(stepSize)).mul(rayDir))).toVar();

  const accumulatedColor = vec3(0.0).toVar();
  const transmittance = vec3(1.0).toVar();
  const mu = dot(rayDir, uLightDir);
  const fadeZone = stepSize.mul(2.0);

  Loop(int(uMaxSteps), ({ i }) => {
    const distTraveled = float(i).mul(stepSize).add(jitter.mul(stepSize));
    const distRemaining = rayLength.sub(distTraveled);

    If(distRemaining.lessThan(0.0), () => {
      Break();
    });

    const density = getDensity({ p });

    If(density.greaterThan(0.01), () => {
      const lightEnergy = CalculateLightEnergy({ samplePos: p, lightDir: uLightDir });
      const sunL = uSunColor.mul(uSunIntensity).mul(lightEnergy);
      const phase = PhaseFunction({ g: float(0.3), costh: mu });
      const sunScatter = sunL.mul(phase);
      const ambScatter = uAmbientColor.mul(uAmbientIntensity);
      const total = sunScatter.add(ambScatter).mul(density).mul(stepSize);
      const fadeA = smoothstep(0.0, fadeZone, distRemaining);
      const faded = total.mul(fadeA);
      const stepT = exp(
        density.mul(stepSize).mul(EXTINCTION_MULT).mul(uOpacity).negate()
      );

      accumulatedColor.addAssign(transmittance.mul(faded));
      transmittance.mulAssign(stepT);

      If(transmittance.length().lessThan(0.01), () => {
        Break();
      });
    });

    p.addAssign(rayDir.mul(stepSize));
  });

  return vec4(accumulatedColor, float(1.0).sub(transmittance.x));
})();

// WEB WORKER

const parametersClone =
  typeof structuredClone === "function"
    ? structuredClone(toRaw(parameters))
    : JSON.parse(JSON.stringify(toRaw(parameters)));
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
  volumeTex.value = texture;
};

// Animate offsets + update matrices and light dir
const animatedOffset = new Vector3();
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  const dt = delta ?? 0.016;
  animatedOffset.x += parameters.animationSpeedX * dt;
  animatedOffset.y += parameters.animationSpeedY * dt;
  animatedOffset.z += parameters.animationSpeedZ * dt;
  uTextureOffset.value.copy(animatedOffset);

  // uTextureTiling.value = parameters.textureTiling;
  // uAmbientIntensity.value = parameters.ambientLightIntensity;
  // uOpacity.value = parameters.opacity;
  // uMaxSteps.value = parameters.raymarchSteps;
  // uLightSteps.value = parameters.lightSteps;
  // uDensityThreshold.value = parameters.densityThreshold;
  // uDensityMultiplier.value = parameters.densityMultiplier;
});
</script>

<template>
  <!-- Volumetric Cloud Container (unit cube scaled up) -->
  <TresMesh :position="[parameters.positionX, parameters.positionY, parameters.positionZ]" :scale="parameters.containerScale" :material>
    <TresBoxGeometry :args="[1, 1, 1]" />
  </TresMesh>
</template>
