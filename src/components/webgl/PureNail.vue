<script setup>
import { shallowRef, watch } from 'vue';
import { useGLTF, Sparkles, BakeShadows } from '@tresjs/cientos'

defineProps({
    scaleFactor: Number,
})

const nailRef = shallowRef(null)

const { scene } = await useGLTF('/models/Pure_Nail.glb', { draco: true })
const { scene: iron } = await useGLTF('/models/iron_chain.glb')
const iron2 = iron.clone()

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
        :object="scene">
        <Sparkles :scale="scaleFactor" :position="[-0.25, -12, 1.9]"
            :sequence-alpha="[[0., 0.], [0.6, 1.0], [0.7, 0.0], [1.0, 1.0]]"
            :sequence-color="['yellow', 'white', 'orange', 'red', 'black']"
            :sequence-offset="[[0.7, [0, 0, 0]], [0.75, [0, 0.1, 0]], [1.0, [0, 0.5, 0]]]"
            :sequence-size="[[0.0, 0.0], [0.7, 1.0]]" :sequence-surface-distance="[[0.0, 0.0], [0.7, 1.0]]"
            :lifetime-sec="3.0" :size="2" :surface-distance="0.8" :mix-color="1.0" />
    </primitive>
    <TresGroup  >
        <!--  -->
        <primitive :object="iron"  :position="[-6,-1,-4]" :rotation-z="Math.PI * 0.15" />
        <primitive :object="iron2"  :position="[6,-1,-6]" :rotation-z="-Math.PI * 0.20" />
    </TresGroup>
    <BakeShadows />
</template>