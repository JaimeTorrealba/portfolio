<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { BackSide, AdditiveBlending, Color } from 'three'
import {
  positionLocal, normalLocal,
  time, vec4, vec2, fract, sin, dot, mix, smoothstep, Fn, float, floor, uniform
} from 'three/tsl'
import { usePaneStore } from '@/stores/pane'

const options = reactive({
  color: '#e4e4e4',
  smoothMin: 0.6,
  smoothMax: 0,
  uvScale: 3,
  speed: 0.25,
  intensity: 0.1,
  horizonStart: -0.05,
  horizonEnd: 0.15,
})

const uColor     = uniform(new Color(1, 1, 1))
const uSmoothMin = uniform(options.smoothMin)
const uSmoothMax = uniform(options.smoothMax)
const uUvScale   = uniform(options.uvScale)
const uSpeed     = uniform(options.speed)
const uIntensity    = uniform(options.intensity)
const uHorizonStart = uniform(options.horizonStart)
const uHorizonEnd   = uniform(options.horizonEnd)

const hash = (p) =>
  fract(sin(dot(p, vec2(127.1, 311.7))).mul(43758.5453123))

const vnoise = (p) => {
  const i = floor(p)
  const f = fract(p)
  const u = f.mul(f).mul(float(3.0).sub(f.mul(2.0)))
  return mix(
    mix(hash(i), hash(i.add(vec2(1.0, 0.0))), u.x),
    mix(hash(i.add(vec2(0.0, 1.0))), hash(i.add(vec2(1.0, 1.0))), u.x),
    u.y
  )
}

// FBM — 3 octaves, same as before but extracted so triplanar can call it per axis
const fbm = (coords) => {
  const o1 = vnoise(coords)
  const o2 = vnoise(coords.mul(2.1).add(vec2(1.7, 9.2)))
  const o3 = vnoise(coords.mul(4.41).add(vec2(10.3, 11.0)))
  return o1.mul(0.5).add(o2.mul(0.25)).add(o3.mul(0.125))
}

const material = new MeshBasicNodeMaterial()
material.transparent = true
material.depthWrite = false
material.fog = false
material.side = BackSide
material.blending = AdditiveBlending

material.colorNode = Fn(() => {
  // Scale world position into noise space (radius 449 → ~1 unit per "cloud")
  const pos  = positionLocal.mul(uUvScale.mul(0.009))
  const anim = vec2(time.mul(uSpeed), time.mul(uSpeed.mul(0.5)))

  // Triplanar: sample noise on each axis plane, blend by abs(normal)
  const nx = fbm(pos.yz.add(anim))
  const ny = fbm(pos.xz)
  const nz = fbm(pos.xy.add(anim))

  const weights = normalLocal.abs()
  const cloud   = nx.mul(weights.x).add(ny.mul(weights.y)).add(nz.mul(weights.z))

  const mask        = smoothstep(uSmoothMin, uSmoothMax, cloud)
  const horizonFade = smoothstep(uHorizonStart, uHorizonEnd, normalLocal.y)
  return vec4(uColor.mul(mask).mul(horizonFade).mul(uIntensity), 1.0)
})()

onMounted(() => {
  if (!window.location.href.includes('#debug')) return
  const store = usePaneStore()
  const pane = store.pane
  const folder = pane.addFolder({ title: 'Clouds', expanded: false })

  folder.addBinding(options, 'color').on('change', ({ value }) => {
    uColor.value.set(value)
  })
  folder.addBinding(options, 'intensity', { min: 0, max: 5, step: 0.01 }).on('change', ({ value }) => {
    uIntensity.value = value
  })
  folder.addBinding(options, 'uvScale', { min: 0.1, max: 25, step: 0.1 }).on('change', ({ value }) => {
    uUvScale.value = value
  })
  folder.addBinding(options, 'speed', { min: 0, max: 5, step: 0.001 }).on('change', ({ value }) => {
    uSpeed.value = value
  })

  const maskFolder = folder.addFolder({ title: 'Mask' })
  maskFolder.addBinding(options, 'smoothMin', { min: 0, max: 1, step: 0.01 }).on('change', ({ value }) => {
    uSmoothMin.value = value
  })
  maskFolder.addBinding(options, 'smoothMax', { min: 0, max: 1, step: 0.01 }).on('change', ({ value }) => {
    uSmoothMax.value = value
  })

  const horizonFolder = folder.addFolder({ title: 'Horizon Fade' })
  horizonFolder.addBinding(options, 'horizonStart', { min: -0.5, max: 0.5, step: 0.01 }).on('change', ({ value }) => {
    uHorizonStart.value = value
  })
  horizonFolder.addBinding(options, 'horizonEnd', { min: -0.5, max: 0.5, step: 0.01 }).on('change', ({ value }) => {
    uHorizonEnd.value = value
  })
})

const geometryRef = ref()
onUnmounted(() => {
  geometryRef.value?.dispose()
  material.dispose()
})
</script>

<template>
  <TresMesh :render-order="-1" :material="material">
    <TresSphereGeometry ref="geometryRef" :args="[449, 16, 8]" />
  </TresMesh>
</template>
