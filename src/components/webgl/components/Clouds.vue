<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useTexture } from '@tresjs/cientos'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { BackSide, AdditiveBlending, Color, RepeatWrapping } from 'three'
import {
  positionLocal, normalLocal,
  time, vec4, vec2, smoothstep, Fn, uniform, texture
} from 'three/tsl'
import { usePaneStore } from '@/stores/pane'

const options = reactive({
  color: '#e4e4e4',
  smoothMin: 0.6,
  smoothMax: 0,
  uvScale: 0.1,
  speed: 0.012,
  intensity: 0.5,
  horizonStart: -0.05,
  horizonEnd: 0.15,
})

const uColor        = uniform(new Color(1, 1, 1))
const uSmoothMin    = uniform(options.smoothMin)
const uSmoothMax    = uniform(options.smoothMax)
const uUvScale      = uniform(options.uvScale)
const uSpeed        = uniform(options.speed)
const uIntensity    = uniform(options.intensity)
const uHorizonStart = uniform(options.horizonStart)
const uHorizonEnd   = uniform(options.horizonEnd)

const material = new MeshBasicNodeMaterial()
material.transparent = true
material.depthWrite = false
material.fog = false
material.side = BackSide
material.blending = AdditiveBlending

const { state: noiseTex } = useTexture('/textures/perlin.png')

watch(noiseTex, (tex) => {
  if (!tex) return
  tex.wrapS = tex.wrapT = RepeatWrapping

  // 3-octave texture FBM — coords already include any animation offset
  const sample = (coords) =>
    texture(tex, coords).r.mul(0.5)
      .add(texture(tex, coords.mul(2.1).add(vec2(1.7, 9.2))).r.mul(0.25))
      .add(texture(tex, coords.mul(4.41).add(vec2(10.3, 11.0))).r.mul(0.125))

  material.colorNode = Fn(() => {
    const pos  = positionLocal.mul(uUvScale.mul(0.009))
    const anim = vec2(time.mul(uSpeed), time.mul(uSpeed.mul(0.5)))

    const nx = sample(pos.yz.add(anim))
    const ny = sample(pos.xz)
    const nz = sample(pos.xy.add(anim))

    const weights = normalLocal.abs()
    const cloud   = nx.mul(weights.x).add(ny.mul(weights.y)).add(nz.mul(weights.z))

    const mask        = smoothstep(uSmoothMin, uSmoothMax, cloud)
    const horizonFade = smoothstep(uHorizonStart, uHorizonEnd, normalLocal.y)
    return vec4(uColor.mul(mask).mul(horizonFade).mul(uIntensity), 1.0)
  })()
  material.needsUpdate = true
}, { immediate: true })

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
  <TresMesh v-if="noiseTex" :render-order="-1" :material="material">
    <TresSphereGeometry ref="geometryRef" :args="[449, 48, 24]" />
  </TresMesh>
</template>
