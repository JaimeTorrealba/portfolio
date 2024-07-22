<script setup>
import { ref } from 'vue'
import { useLoop } from '@tresjs/core'
import { gsap } from 'gsap'
import { useMainStore } from '@/stores'
import fragment from '../shaders/mouse_circle/fragment.glsl'
import vertex from '../shaders/mouse_circle/vertex.glsl'

// TODO border in fragment
// TODO showFirstPage have problem needs reactivity

defineProps({
    scaleFactor: Number,
    route: Object,
})

const store = useMainStore()

const triangleVertices = new Float32Array([
    0, -0.577, 0, // v0
    5, 25, 0, // v2
    -5, 25, 0, // v1
]);

const mouseShader = {
    uniforms: {
        uTime: { value: 0.0 },
    },
    fragmentShader: fragment,
    vertexShader: vertex,
}

const showCircle = ref(false)
const hasAllWords = ref(false)
const circleRef = ref(false)

const onEnterGsap = (el, done) => {
    gsap.from(el.scale, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic',
        onComplete: done
    })
}
const onLeaveGsap = (el, done) => {
    gsap.to(el.material, {
        opacity: 0,
        onComplete: done,
        duration: 0.005,
    })
}

const onEnter = (e) => {
    if (!store.showFirstPage) return
    const body = document.getElementsByTagName("BODY")[0]
    if(hasAllWords.value) {
        body.style.cursor = ''
        showCircle.value = false
    } else {
        body.style.cursor = 'none'
        showCircle.value = true
    }
    if (!circleRef.value) return
    circleRef.value.position.x = e.point.x
    circleRef.value.position.y = e.point.y
}
const onLeave = () => {
    const body = document.getElementsByTagName("BODY")[0]
    body.style.cursor = "";
    showCircle.value = false
}

const ShowLetters = () => {
    const numberWords = 7
    // number of words, should be fixed
    if(store.HKWordsIndex === numberWords -1) {
        hasAllWords.value = true
        return
    }
    store.HKWordsIndex++
}

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
    mouseShader.uniforms.uTime.value = elapsed
})
</script>
<template>
    <TresMesh :position="[0, -0.5, 5]" :visible="false" @pointer-enter="onEnter"
        @pointer-leave="onLeave" @click="() => ShowLetters()" :scale="scaleFactor * 0.25">
        <TresBufferGeometry :position="[triangleVertices, 3]" />
        <TresMeshBasicMaterial color="red" />
    </TresMesh>
    <Transition :css="false" @enter="onEnterGsap" @leave="onLeaveGsap">
        <TresMesh ref="circleRef" :position="[0, 2.5, 7]" v-if="showCircle">
            <TresCircleGeometry :args="[0.15, 16]" />
            <TresShaderMaterial v-bind="mouseShader" />
        </TresMesh>
    </Transition>
</template>