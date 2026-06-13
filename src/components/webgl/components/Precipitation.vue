<script setup>
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import {
  InstancedMesh, PlaneGeometry, MeshBasicMaterial,
  CanvasTexture, AdditiveBlending,
  Matrix4, Vector3, Quaternion, Color,
} from 'three'
import { usePaneStore } from '@/stores/pane'

const options = {
  speed:   0.25,
  size:    0.1,
  opacity: 0.5,
}

const COUNT  = 50
const AREA_X = 20
const AREA_Y = 20
const Z_NEAR = 15
const Z_FAR  = -45

// Per-firefly data
const positions  = new Float32Array(COUNT * 3)
const baseColors = new Float32Array(COUNT * 3)
const seeds      = new Float32Array(COUNT * 4) // [pulseSpeed, pulsePhase, driftXFreq, driftYFreq]

for (let i = 0; i < COUNT; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * AREA_X
  positions[i * 3 + 1] = (Math.random() - 0.5) * AREA_Y
  positions[i * 3 + 2] = Math.random() * (Z_NEAR - Z_FAR) + Z_FAR

  seeds[i * 4]     = 0.8 + Math.random() * 1.4
  seeds[i * 4 + 1] = Math.random() * Math.PI * 2
  seeds[i * 4 + 2] = 0.25 + Math.random() * 0.45
  seeds[i * 4 + 3] = 0.25 + Math.random() * 0.45

  baseColors[i * 3]     = 0.60 + Math.random() * 0.30
  baseColors[i * 3 + 1] = 0.82 + Math.random() * 0.15
  baseColors[i * 3 + 2] = Math.random() * 0.12
}

function createGlowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  g.addColorStop(0.6,  'rgba(255,255,255,0.2)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

const { camera } = useTresContext()
const groupRef = shallowRef()
let mesh = null

const _mat  = new Matrix4()
const _pos  = new Vector3()
const _scl  = new Vector3()
const _col  = new Color()
const _camQuat = new Quaternion()

onMounted(() => {
  const geo = new PlaneGeometry(1, 1)
  const mat = new MeshBasicMaterial({
    map:         createGlowTexture(),
    transparent: true,
    depthWrite:  false,
    blending:    AdditiveBlending,
    opacity:     options.opacity,
  })

  mesh = new InstancedMesh(geo, mat, COUNT)
  mesh.instanceMatrix.setUsage(35048) // DYNAMIC_DRAW
  mesh.frustumCulled = false
  groupRef.value.add(mesh)

  if (!window.location.href.includes('#debug')) return
  const store = usePaneStore()
  const pane = store.pane
  const folder = pane.addFolder({ title: 'Fireflies', expanded: false })
  folder.addBinding(options, 'speed',   { min: 0,    max: 0.5, step: 0.01 })
  folder.addBinding(options, 'size',    { min: 0.1,  max: 5,   step: 0.05 })
  folder.addBinding(options, 'opacity', { min: 0,    max: 1,   step: 0.01 }).on('change', ({ value }) => {
    mat.opacity = value
  })
})

onUnmounted(() => {
  if (mesh) {
    mesh.geometry.dispose()
    mesh.material.map?.dispose()
    mesh.material.dispose()
  }
})

const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  if (!mesh || !camera.activeCamera.value) return

  camera.activeCamera.value.getWorldQuaternion(_camQuat)

  for (let i = 0; i < COUNT; i++) {
    const pulseSpeed = seeds[i * 4]
    const pulsePhase = seeds[i * 4 + 1]
    const driftXFreq = seeds[i * 4 + 2]
    const driftYFreq = seeds[i * 4 + 3]

    const raw        = Math.sin(elapsed * pulseSpeed + pulsePhase)
    const brightness = Math.pow(Math.max(0, raw), 2)

    // Drift
    positions[i * 3]     += Math.sin(elapsed * driftXFreq + pulsePhase * 3.7) * 0.004
    positions[i * 3 + 1] += Math.sin(elapsed * driftYFreq + pulsePhase * 2.3) * 0.003
    positions[i * 3 + 2] += options.speed

    if (positions[i * 3 + 2] > Z_NEAR) {
      positions[i * 3 + 2] = Z_FAR
      positions[i * 3]     = (Math.random() - 0.5) * AREA_X
      positions[i * 3 + 1] = (Math.random() - 0.5) * AREA_Y
    }

    _pos.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
    _scl.setScalar(options.size * (0.5 + brightness * 0.7))
    _mat.compose(_pos, _camQuat, _scl)
    mesh.setMatrixAt(i, _mat)

    _col.setRGB(
      baseColors[i * 3]     * brightness,
      baseColors[i * 3 + 1] * brightness,
      baseColors[i * 3 + 2] * brightness,
    )
    mesh.setColorAt(i, _col)
  }

  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
})
</script>

<template>
  <TresGroup ref="groupRef" :position="[0, 5, 0]" />
</template>
