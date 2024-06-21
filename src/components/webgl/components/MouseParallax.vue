<script setup>
import { computed, ref, toRefs, watch } from 'vue'
import { useRenderLoop, useTresContext } from '@tresjs/core'
import { useMouse, useWindowSize } from '@vueuse/core'

const props = defineProps({
    disabled: Boolean,
    factor: { type: Number, default: 5 },
    ease: { type: Number, default: 1 },
})

const { camera } = useTresContext()

const { disabled, factor, ease } = toRefs(props)

const { x } = useMouse()
const { width } = useWindowSize()

const cameraGroupRef = ref()

const cursorX = computed(() => (x.value / width.value - 0.5) * factor.value)

const { onLoop } = useRenderLoop()

onLoop(({ delta }) => {
    if (
        disabled.value
        || !cameraGroupRef.value
        || Number.isNaN(cursorX.value)
    ) {
        return
    }
    cameraGroupRef.value.position.x
        += (cursorX.value - cameraGroupRef.value.position.x) * ease.value * delta
})

watch(
    () => cameraGroupRef.value,
    value => value?.add(camera.value),
)
watch(
    factor, (value) => {
        console.log('jaime ~ value:', value);
        
    }
)
</script>

<template>
    <TresGroup ref="cameraGroupRef" />
</template>
