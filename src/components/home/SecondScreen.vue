<script setup>
import { nextTick, watchEffect } from 'vue';
import { gsap } from 'gsap';
import { useMainStore } from "@/stores";

const props = defineProps({
    firstScreen: { required: true, type: Boolean },
})
const store = useMainStore()

const comingFromSide = (node, x,) => {
    gsap.from(node, {
        duration: 0.5,
        x,
        opacity: 0,
        ease: 'power1.inOut',
    });
};

const playAnimation = async () => {
    await nextTick()
    const menuItems = gsap.utils.toArray(".menu-items")
    menuItems.forEach((item, index) => {
        if (index % 2 === 0) {
            comingFromSide(item, -100)
        } else {
            comingFromSide(item, 100)
        }
    })
}

watchEffect(() => {
    if (!props.firstScreen && store.finishLoading) {
        playAnimation()
    }
})

</script>
<template>
    <section class="content-v2">
        <ul class="flex flex-column flex-center-column">
            <li class="menu-items bloom-effect-tiny line-through"><router-link to="/projects"> Projects </router-link>
            </li>
            <li class="menu-items bloom-effect-tiny"><router-link to="/about-me"> About me </router-link>
            </li>
            <li class="menu-items bloom-effect-tiny"><router-link to="/ContactMe"> Contact me </router-link></li>
            <li class="menu-items bloom-effect-tiny line-through"><router-link to="/settings"> Settings </router-link>
            </li>
            <li class="menu-items bloom-effect-tiny pointer" @click="$emit('firstScreen', true)"> Exit </li>
        </ul>
    </section>
</template>
<style scoped>
.content-v2 {
    grid-area: 3 / 2 / 4 / 3;
}

.menu-items {
    margin: 0.5rem;
    font-size: var(--step-0);
    transition: transform 0.3s;
}

.menu-items:hover {
    transform: scale(1.1) !important;
}

.pointer {
    cursor: pointer;
}

.line-through {
    text-decoration: line-through;
}

</style>