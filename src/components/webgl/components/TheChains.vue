<script setup>

const props = defineProps({
    scaleFactor: Number,
    model: Object
})

const model2 = props.model.clone()
const model3 = props.model.clone()
const model4 = props.model.clone()
</script>
<template>
    <TresGroup>
        <primitive :object="model" :position="[-7, -1, 8]" :rotation-z="Math.PI * 0.15" />
        <primitive :object="model2" :position="[6, -1, 12]" :rotation-z="-Math.PI * 0.20" />
        <primitive :object="model3" :position="[6, -1, -4]" :rotation-z="Math.PI * 0.25" />
        <primitive :object="model4" :position="[-6, -1, -4]" :rotation-z="-Math.PI * 0.25" />
    </TresGroup>
</template>