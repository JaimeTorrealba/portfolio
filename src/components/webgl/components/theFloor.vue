<script setup>
import { RepeatWrapping } from 'three'

const props = defineProps(['textures'])

const setDefaultTextures = (obj, repeat = [4, 4]) => {
  Object.keys(obj).map((key) => {
    if (obj[key]?.isTexture) {
      obj[key].repeat.set(repeat[0], repeat[1])
      obj[key].wrapS = RepeatWrapping
      obj[key].wrapT = RepeatWrapping
    }
  })
}

setDefaultTextures(props.textures)
</script>
<template>
    <TresMesh :position-y="-0.25" :rotate-x="Math.PI * -0.5" receive-shadow name="Floor">
        <TresPlaneGeometry :args="[40, 40, 100, 100]" />
        <TresMeshStandardMaterial v-bind="textures" :normal-scale="1" :displacement-scale="0.5"  />
    </TresMesh>
</template>