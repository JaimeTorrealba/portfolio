<script setup>
import { nextTick, watchEffect, computed, ref } from 'vue';
import { gsap } from 'gsap';
import { useMainStore } from "@/stores";
import { useSettingStore } from "@/stores/settings";
import { breakpoints } from "@/utils/constants";
import { useMouse, useWindowSize } from "@vueuse/core";

const props = defineProps({
    firstScreen: { required: true, type: Boolean },
})
const store = useMainStore()
const settingStore = useSettingStore()
const { sourceType } = useMouse()
const { width } = useWindowSize()
const isLargeScreen = computed(() => width.value >= breakpoints.TABLET)

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


const menuItems = [
    { name: 'Soon', path: '/resume' },
    { name: 'Soon', path: '/about-mess' }, // disabled for now
    { name: 'Contact me', path: '/ContactMe' },
    { name: 'Soon', path: '/settings' },
    { name: 'Exit', path: '/' },
]

const isActive = ref(0)

const activate = (index) => {
    if (isLargeScreen.value && sourceType.value === 'mouse') {
        isActive.value = index // not used yet, but soon
        // sidebarStore.activeLink = index
        settingStore.hoverElement()
    }
}

const checkLasItem = () => {
    if(isActive.value === menuItems.length - 1){
        store.showFirstPage = true
    }
}
</script>
<template>
    <nav class="content-v2">
        <ul class="flex flex-column flex-center-column">
            <li class="menu-items bloom-effect-tiny" v-for="({ name, path }, index) in menuItems" :key="name"
                @mouseenter="activate(index)">
                <router-link :to="path" @click="checkLasItem"> {{ name }} </router-link>
            </li>
        </ul>
    </nav>
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