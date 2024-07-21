<script setup>
import { useLoop, useTresContext } from '@tresjs/core'
import { Precipitation, MouseParallax } from '@tresjs/cientos'

defineProps({
        parallaxFactor: Number,
        startParticle: Object,
})

const { camera } = useTresContext()

const { onBeforeRender } = useLoop()
onBeforeRender(() => {
        camera.value.lookAt(0, 3.5, 0)
})
</script>
<template>
        <TresFog color="#111" near="8" far="40" />
        <MouseParallax :ease="1" :factor="parallaxFactor" />
        <Precipitation :rotation-z="Math.PI" :area="[30, 30, 30]" :randomness="50" :count="500" :size="0.25"
                :color="0xf7f7f7" :speed="0.001" :opacity="0.8" :transparent="true" :alphaMap="startParticle" />
        <TresAmbientLight color="#F5EBD4" :intensity="0.05" />
        <TresSpotLight ref="spotLightRef" cast-shadow color="#F5EBD4" :intensity="12" :penumbra="1"
                :angle="Math.PI * 0.4" :decay="1.25" :position="[-4, 10, 4]" />
        <TresPointLight color="#F5EBD4" :intensity="5" :position="[0, 7, -2]" />
</template>