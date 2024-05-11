<script setup>
import { useTexture } from '@tresjs/core'

defineProps({
    scaleFactor: Number,
})

const floorMap = await useTexture({
    map: '/textures/floor/dry_riverbed_rock_diff_1k.jpg',
    normalMap: '/textures/floor/dry_riverbed_rock_nor_gl_1k.jpg',
    roughnessMap: '/textures/floor/dry_riverbed_rock_rough_1k.jpg',
    displacementMap: '/textures/floor/dry_riverbed_rock_disp_1k.jpg',
})
</script>
<template>
    <TresMesh :scale="scaleFactor" :position-y="-1" :rotate-x="Math.PI * -0.5" receive-shadow name="Floor">
        <TresCircleGeometry :args="[20, 100]" />
        <TresMeshStandardMaterial v-bind="floorMap" :displacementScale="1.25" />
    </TresMesh>
</template>