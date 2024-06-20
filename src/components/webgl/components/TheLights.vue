<script setup>
import { shallowRef } from 'vue'
import { useRenderLoop } from '@tresjs/core'

const fireLight = shallowRef(null)

const { onLoop } = useRenderLoop()

onLoop(() => {
    if (fireLight.value) {
        if(Math.random() > 0.7) {
            fireLight.value.intensity = (Math.random() * 0.25) + 1.25
        }
    }
})
</script>
<template>
    <TresGroup>
        <TresAmbientLight color="#F5EBD4" :intensity="0.025" />
        <TresSpotLight ref="spotLightRef" cast-shadow color="#F5EBD4" :intensity="12" :penumbra="1" :angle="Math.PI * 0.4"
        :decay="1.25" :position="[-4, 10, 4]" />
        <TresPointLight ref="fireLight" :position="[-1, 1, 6]" color="#F5EBD4" :intensity="1.5" :distance="4" />
        <TresPointLight ref="fireLight" :position="[1, 1, 6]" color="#F5EBD4" :intensity="1.5" :distance="4" />
    </TresGroup>
</template>