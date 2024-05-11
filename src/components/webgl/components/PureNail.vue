<script setup>
import { shallowRef, watch } from 'vue';
import { useGLTF, BakeShadows } from '@tresjs/cientos'

defineProps({
    scaleFactor: Number,
})

const nailRef = shallowRef(null)

const { scene } = await useGLTF('/models/Pure_Nail.glb', { draco: true })

watch(nailRef, (nail) => {
    nail.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
        }
    })
})
</script>
<template>
    <primitive ref="nailRef" name="nail" :scale="scaleFactor * 0.25" :position="[0, 2.5 * scaleFactor, 3]"
        :object="scene" />
    <BakeShadows />
</template>