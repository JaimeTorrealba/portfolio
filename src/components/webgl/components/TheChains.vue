<script setup>
import { useGLTF } from '@tresjs/cientos'

const { scene: iron } = await useGLTF('/models/iron_chain.glb')
const iron2 = iron.clone()
</script>
<template>
    <TresGroup>
        <primitive :object="iron" :position="[-5, -1, -4]" :rotation-z="Math.PI * 0.15" />
        <primitive :object="iron2" :position="[6, -1, -6]" :rotation-z="-Math.PI * 0.20" />
    </TresGroup>
</template>