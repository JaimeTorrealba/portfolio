<script setup>
import { watchEffect, nextTick } from "vue";
import { gsap } from "gsap";
import { useMainStore } from "@/stores";
import { showText, appear } from "@/utils/gsaps.js";
import YogSothothIcon from "@/assets/icons/YogSothothIcon.vue";

const props = defineProps({
    firstScreen: { required: true, type: Boolean },
})
const store = useMainStore()

const expandLine = () => {
    const line = document.querySelector('.left-line-home')
    gsap.to(line, { duration: 1, height: '95%', opacity: 0.5, ease: 'power2.out', delay: 1.25 })
}

const onHover = (isHover) => {
    const icon = document.getElementById('YogSothoth')
    const cls1 = gsap.utils.toArray(icon.querySelectorAll('.cls-1'))
    const cls2 = gsap.utils.toArray(icon.querySelectorAll('.cls-2'))
    gsap.set(cls1, { fill: '#ccc', duration: 0.3 })
    gsap.set(cls2, { fill: '#b2b2b2', duration: 0.3 })
    if (isHover) {
        gsap.to(cls1, { fill: '#e4e4e4', duration: 0.3 })
        gsap.to(cls2, { fill: '#333', duration: 0.3 })
    } else {
        gsap.to(cls1, { fill: '#ccc', duration: 0.3 })
        gsap.to(cls2, { fill: '#b2b2b2', duration: 0.3 })
    }
}

const playAnimation = async () => {
    await nextTick()
    const master = gsap.timeline()
    master.add(showText('#HomeTitle', { delay: 0 }, 'void'))
    master.add(showText('#HomeDescription', {}, 'void'), '-=1')
    master.add(appear('#ExploreButton'), '-=0.75')
    expandLine()
}

watchEffect(async () => {
    if (props.firstScreen && store.finishLoading) {
        playAnimation()
    }
})

</script>
<template>
    <section class="content-v1 flex flex-column relative" v-show="store.finishLoading">
        <div class="px-l">
            <h1 class="h1-large bloom-effect-tiny " id="HomeTitle">Jaime <br />
                Torrealba</h1>
            <h2 class="h2 bloom-effect-tiny  py-l" id="HomeDescription">Creative developer</h2>
        </div>
        <div></div>
        <div class="px-l" id="ExploreButton">
            <button class="outline-button custom-padding flex flex-center-column" @click="$emit('firstScreen', false)" @mouseenter="onHover(true)" @mouseleave="onHover(false)">Explore <YogSothothIcon /></button>
        </div>
        <div class="left-line-home"></div>
    </section>
</template>
<style scoped>
.content-v1 {
    grid-area: 1 / 1 / 4 / 2;
    height: 90vh;
    padding: 2rem;
    justify-content: space-between
}

.custom-padding {
    padding-inline: 2rem;
}

.left-line-home {
    position: absolute;
    left: 5%;
    top: 5%;
    transform: translateY(-0%);
    opacity: 1;
    width: 1px;
    height: 0;
    background-color: #f7f7f7;
}
</style>