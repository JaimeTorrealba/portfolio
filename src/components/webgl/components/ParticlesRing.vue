<script setup>
import { shallowRef, toRefs, watchEffect } from 'vue'
import { useRenderLoop } from '@tresjs/core'


const props = defineProps({
  size: { default: 0.25, },
  area: { default: () => [30, 30, 30], },
  color: { default: 0x333, },
  alphaTest: { default: 0.01, },
  opacity: { default: 1, },
  count: { default: 250, },
  speed: { default: 0.001, },
  randomness: { default: 1, },
  depthWrite: { default: true, },
  transparent: { default: true, },
  sizeAttenuation: { default: true, },
  alphaMap: { default: null, },
})

const {
  size,
  area,
  color,
  alphaMap,
  map,
  opacity,
  alphaTest,
  depthWrite,
  transparent,
  sizeAttenuation,
  count,
  speed,
  randomness,
} = toRefs(props)

const geometryRef = shallowRef()
let positionArray = []
let velocityArray = []

const setPosition = () => {
  positionArray = new Float32Array(count.value * 3)
  for (let i = 0; i < count.value; i++) {
    const i3 = i * 3
    positionArray[i3] = (Math.random() - 0.5) * area.value[0]
    positionArray[i3 + 1] = (Math.random() - 0.5) * area.value[1]
    positionArray[i3 + 2] = (Math.random() - 0.5) * area.value[2]
  }
}
const setSpeed = () => {
  velocityArray = new Float32Array(count.value * 2)
  for (let i = 0; i < count.value * 2; i += 2) {
    velocityArray[i] = ((Math.random() - 0.5) / 5) * speed.value * randomness.value
    velocityArray[i + 1] = (Math.random() / 5) * speed.value + 0.01
  }
}
setSpeed()
setPosition()

watchEffect(() => {
  setSpeed()
  setPosition()
})

const { onLoop } = useRenderLoop()

onLoop(() => {
  if (geometryRef.value?.attributes.position.array && geometryRef.value?.attributes.position.count) {
    const positionArray = geometryRef.value.attributes.position.array
    for (let i = 0; i < geometryRef.value.attributes.position.count; i++) {
      const velocityX = velocityArray[i * 2]
      const velocityY = velocityArray[i * 2 + 1]

      positionArray[i * 3] += velocityX
      positionArray[i * 3 + 1] -= velocityY

      if (positionArray[i * 3] <= -area.value[0] / 2 || positionArray[i * 3] >= area.value[0] / 2) { positionArray[i * 3] = positionArray[i * 3] * -1 }
      if (positionArray[i * 3 + 1] <= -area.value[1] / 2 || positionArray[i * 3 + 1] >= area.value[1] / 2) { positionArray[i * 3 + 1] = positionArray[i * 3 + 1] * -1 }
    }
    geometryRef.value.attributes.position.needsUpdate = true
  }
})
</script>

<template>
  <TresPoints :rotation-z="Math.PI">
    <TresPointsMaterial :size="size" :color="color" :alpha-map="alphaMap" :map="map" :opacity="opacity"
      :alpha-test="alphaTest" :depth-write="depthWrite" :transparent="transparent"
      :size-attenuation="sizeAttenuation" />
    <TresBufferGeometry ref="geometryRef" :position="[positionArray, 3]" :velocity="[velocityArray]" />
  </TresPoints>
</template>
