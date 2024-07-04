<script setup>
import { shallowRef, watch } from 'vue';

defineProps({
    scaleFactor: Number,
    model: Object
})

const nailRef = shallowRef(null)

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
        :object="model" />

</template>