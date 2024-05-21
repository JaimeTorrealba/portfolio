<script setup>
import { shallowRef } from 'vue'
import { useRenderLoop } from '@tresjs/core'

const fireLight = shallowRef(null)

const { onLoop } = useRenderLoop()

onLoop(() => {
    if (fireLight.value) {
        fireLight.value.intensity =  Math.sin(Date.now() * 0.001) * 0.5 + 1.5
        if(Math.random() > 0.95) {
            fireLight.value.position.x = Math.random() * 0.25
        }
    }
})
</script>
<template>
    <TresGroup>
        <TresAmbientLight color="#F5EBD4" :intensity="0.025" />
        <TresSpotLight ref="spotLightRef" cast-shadow color="#F5EBD4" :intensity="12" :penumbra="1" :angle="Math.PI * 0.4"
        :decay="1.25" :position="[-4, 10, 4]" />
        <TresPointLight ref="fireLight" :position="[0, 1, 6]" color="#F5EBD4" :intensity="1.5" :distance="4" />
    </TresGroup>
</template>