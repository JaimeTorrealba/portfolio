<script setup>
import { watchEffect, computed, nextTick } from 'vue';
import { gsap } from 'gsap';
import { useWindowSize } from '@vueuse/core'
import { useMainStore } from '@/stores';
import { useCustomRouterFn } from "@/composables/routers.js";
import { lg } from '@/constants'
// import { useSettingStore } from "@/stores/settings";
// import { breakpoints } from "@/utils/constants";
// import { useMouse, useWindowSize } from "@vueuse/core";

const store = useMainStore()
const { width } = useWindowSize()
const { checkRoute } = useCustomRouterFn()

// Animations
const playAnimation = async() => {
  await nextTick()
  const menuItems = gsap.utils.toArray(".menu-items")
  gsap.from(menuItems, {
    duration: 0.5,
    filter: 'blur(10px)',
    opacity: 0,
    stagger: 0.1,
    ease: 'power3.in',
  });
}

watchEffect(() => {
    if (store.finishLoading && checkRoute('Main')) {
        playAnimation()
    }
})

const menuItems = [
  //{ name: 'Soon', path: '/resume' },
  //{ name: 'Soon', path: '/about-mess' }, // disabled for now
  { name: 'Projects', path: '/main/projects' },
  { name: 'Latest Experiences', path: '/main/experiences' },
  { name: 'Creative lab', path: 'https://lab.jaimetorrealba.com/', external: true },
  { name: 'Articles', path: '/main/articles' },
  { name: 'Open source', path: '/main/oss' },
  // { name: 'Courses/Talks', path: '/main/courses_talks' },
  { name: 'Contact me', path: '/main/ContactMe' },
  { name: 'Exit', path: '/' },
  //{ name: 'Soon', path: '/settings' },
]

const showNavBar = computed(() => {
  if (checkRoute('Main')) {
    return true
  } else {
    return width.value > lg
  }
})

// SOUNDS
// const settingStore = useSettingStore()
// const { sourceType } = useMouse()
// const { width } = useWindowSize()
// const isLargeScreen = computed(() => width.value >= breakpoints.TABLET)
// const isActive = ref(0)

// const activate = (index) => {
//     if (isLargeScreen.value && sourceType.value === 'mouse') {
//         isActive.value = index // not used yet, but soon
//         // sidebarStore.activeLink = index
//         settingStore.hoverElement()
//     }
// }
</script>

<template>
  <nav class="content-v2" v-if="showNavBar">
    <ul class="flex flex-column ">
      <li class="my-s bloom-effect-tiny" v-for="({ name, path, external }) in menuItems" :key="name">
        <p class="menu-items">
          <a v-if="external" :href="path" target="_blank" rel="no-referrer"> {{ name }} </a>
          <router-link v-else :to="path"> {{ name }} </router-link>
        </p>
        <!-- @mouseenter="activate(index)" -->
      </li>
    </ul>
  </nav>
  <section class="content-subpages">
    <router-view />
  </section>
</template>
<style scoped>
.content-v2 {
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 9;
  grid-row-end: 10;

  @media screen and (max-width: 1024px) {
    grid-column-start: 2;
    grid-column-end: 12;
    grid-row-start: 5;
    grid-row-end: 11;
  }
}

.content-subpages{
  grid-column-start: 4;
  grid-column-end: 12;
  grid-row-start: 2;
  grid-row-end: 12;
  @media screen and (max-width: 1024px) {
    grid-column-start: 2;
    grid-column-end: 12;
    grid-row-start: 2;
    grid-row-end: 12;
  }
}

.menu-items {
  font-size: var(--step-0);
  transition: transform 0.3s;
}

.menu-items:hover {
  transform: scale(1.1) !important;
}
</style>
