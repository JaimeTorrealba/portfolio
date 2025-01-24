<script setup>
import { shallowRef, watch } from 'vue';
import { useLoop } from '@tresjs/core';

defineProps({
    scaleFactor: Number,
    model: Object
})

const modelRef = shallowRef(null)

watch(modelRef, (nail) => {
    nail.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
        }
    })
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
    if (modelRef.value) {
        modelRef.value.rotation.y = elapsed
        modelRef.value.position.y = Math.sin(elapsed) + 3

    }
})
</script>
<template>
    <primitive ref="modelRef" name="nail" :scale="5" :position="[0, 2.5 * scaleFactor, 3]" :object="model" />
</template>