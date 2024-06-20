<script setup>
import { computed, ref, toRefs, watch } from 'vue'
import { useRenderLoop, useTresContext } from '@tresjs/core'
import { useElementSize, useMouse, useWindowSize } from '@vueuse/core'

const props = defineProps({
    disabled: Boolean,
    factor: { type: Number, default: 5 },
    ease: { type: Number, default: 1 },
    local: { type: Boolean, default: false },
})

const { camera, renderer } = useTresContext()

const { disabled, factor, ease, local } = toRefs(props)

const { x } = useMouse()
const { width } = local.value
    ? useElementSize(renderer.value.domElement)
    : useWindowSize()

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
</script>

<template>
    <TresGroup ref="cameraGroupRef" />
</template>
