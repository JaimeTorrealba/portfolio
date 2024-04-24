<script setup>
import { useRenderLoop } from '@tresjs/core'
import { Color, AdditiveBlending } from 'three'
import fragment from './particles_shader/fragment.glsl'
import vertex from './particles_shader/vertex.glsl'

const props = defineProps({
    scaleFactor: Number,
})

const parameters = {}
parameters.count = 250 * props.scaleFactor
parameters.radius = 150
parameters.size = 150
parameters.branches = 5
parameters.spin = 5
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#CEB890'
parameters.outsideColor = '#F7F7F7'

const shader = {
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
  vertexColors: true,
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: { value: 0 },
    uSize: {
      value: parameters.size,
    },
  },
}

const positions = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)
const scales = new Float32Array(parameters.count * 1)
const randomness = new Float32Array(parameters.count * 3)

const insideColor = new Color(parameters.insideColor)
const outsideColor = new Color(parameters.outsideColor)

for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3

  // Position
  const radius = Math.random() * parameters.radius

  const branchAngle =
    ((i % parameters.branches) / parameters.branches) * Math.PI * 2

  positions[i3] = Math.cos(branchAngle) * radius
  positions[i3 + 1] = 0
  positions[i3 + 2] = Math.sin(branchAngle) * radius

  const randomX =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius
  const randomY =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius
  const randomZ =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius

  randomness[i3] = randomX
  randomness[i3 + 1] = randomY
  randomness[i3 + 2] = randomZ

  // Color
  const mixedColor = insideColor.clone()
  mixedColor.lerp(outsideColor, radius / parameters.radius)

  colors[i3] = mixedColor.r
  colors[i3 + 1] = mixedColor.g
  colors[i3 + 2] = mixedColor.b

  //Scale
  scales[i] = Math.random()
}

const { onLoop } = useRenderLoop()
onLoop(({ elapsed }) => {
  shader.uniforms.uTime.value = -elapsed * parameters.spin
})
</script>
<template>
  <TresPoints :position-y="1">
    <TresBufferGeometry :position="[positions, 3]" :a-scale="[scales, 1]" :color="[colors, 3]"
      :a-randomness="[randomness, 3]" />
    <TresShaderMaterial v-bind="shader" />
  </TresPoints>
</template>