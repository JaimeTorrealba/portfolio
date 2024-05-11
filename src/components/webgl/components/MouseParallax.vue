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

const mouseOptions = {}

if (local.value) {
    mouseOptions.target = renderer.value.domElement
    mouseOptions.type = 'client'
}

const { x, y } = useMouse(mouseOptions)
const { width, height } = local.value
    ? useElementSize(renderer.value.domElement)
    : useWindowSize()

const cameraGroupRef = ref()

const cursorX = computed(() => (x.value / width.value - 0.5) * factor.value)
const cursorY = computed(() => -(y.value / height.value - 0.5) * factor.value)

const { onLoop } = useRenderLoop()

onLoop(({ delta }) => {
    if (
        disabled.value
        || !cameraGroupRef.value
        || Number.isNaN(cursorX.value)
        || Number.isNaN(cursorY.value)
    ) {
        return
    }
    cameraGroupRef.value.position.x
        += (cursorX.value - cameraGroupRef.value.position.x) * ease.value * delta
    cameraGroupRef.value.position.y
        += (cursorY.value - cameraGroupRef.value.position.y) * ease.value * delta
})

watch(
    () => cameraGroupRef.value,
    value => value?.add(camera.value),
)
</script>

<template>
    <TresGroup ref="cameraGroupRef" />
</template>
