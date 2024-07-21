<script setup>
import { h, defineComponent } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText)

defineProps({
    wordsIndex: {
        type: Number,
        required: true
    }
})

function onEnter(el, done) {
    const mySplitText = new SplitText(el, { type: 'chars' })
    const words = mySplitText.chars
    gsap.from(words, {
        opacity: 0,
        stagger: 0.025,
        delay: 0.05,
        onComplete: done
    })
}

const nullIndex = defineComponent(() => {
    return () => h('h2', { class: '', innerHTML: '' })
}
)
const firstIndex = defineComponent(() => {
    return () => h('h2', { class: 'hk-words', innerHTML: 'No cost too great.' })
}
)

const secondIndex = defineComponent(() => {
    return () => h('h2', { class: 'hk-words', innerHTML: 'No mind to think.' })
}
)
const thirdIndex = defineComponent(() => {
    return () => h('h2', { class: 'hk-words', innerHTML: 'No will to break.' })
}
)
const forthIndex = defineComponent(() => {
    return () => h('h2', { class: 'hk-words', innerHTML: 'No voice to cry suffering.' })
}
)
const fifthIndex = defineComponent(() => {
    return () => h('h2', { class: 'hk-words', innerHTML: 'Born of God and Void.' })
}
)

const components = [
    nullIndex,
    firstIndex,
    secondIndex,
    thirdIndex,
    forthIndex,
    fifthIndex,
    nullIndex
]


</script>
<template>
    <div class="fixed flex flex-center">
        <Transition @enter="onEnter" :css="false">
            <component :is="components[wordsIndex]" />
        </Transition>
    </div>
</template>
<style>
.fixed {
    position: fixed;
    top: 1%;
    z-index: 1000;
    width: 100%;
}

.hk-words {
    font-size: 2rem;
    color: white;
    text-align: center;
}
</style>