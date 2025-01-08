<script setup>
import { nextTick, watchEffect } from "vue";
import { gsap } from "gsap";
import { useMainStore } from "@/stores";
import { useCustomRouterFn } from "@/composables/routers.js";
import { showText, appear } from "@/utils/gsaps.js";
import YogSothothIcon from "@/assets/icons/YogSothothIcon.vue";

const store = useMainStore()
const { goToMain: _goToMain, checkRoute } = useCustomRouterFn()

const goToMain = () => _goToMain()

const onHover = (isHover) => {
  const icon = document.getElementById('YogSothothID')
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

const expandLine = () => {
  const line = document.querySelector('.left-line-home')
  gsap.to(line, { duration: 1, height: '92%', opacity: 0.5, ease: 'power2.out', delay: 1.25 })
}

const playAnimation = async () => {
  await nextTick()
  const master = gsap.timeline()
  master.add(showText('#HomeTitle'))
  master.add(showText('#HomeDescription'), '-=0.5')
  master.add(expandLine())
  master.add(appear('#ExploreButton'), '-=0.5')
}

watchEffect(() => {
  if (store.finishLoading && checkRoute('Home')) {
    playAnimation()
  }
})


</script>

<template>
  <section class="content-v1 flex flex-column relative" v-show="store.finishLoading">
    <div class="px-l overflow-none">
      <h1 class="h1-large bloom-effect-tiny pa-s" id="HomeTitle">Jaime <br />
        Torrealba</h1>
      <h2 class="h2 bloom-effect-tiny  pa-s" id="HomeDescription">Creative developer</h2>
    </div>
    <div></div>
    <div class="pa-s opacity-none" id="ExploreButton" @click="goToMain">
      <button class="outline-button explore-button-padding flex flex-center-column" 
        @mouseenter="onHover(true)" @mouseleave="onHover(false)">Explore
        <YogSothothIcon />
      </button>
    </div>
    <div class="left-line-home opacity-none"></div>
  </section>
</template>
<style scoped>
.content-v1 {
  grid-column-start: 2;
  grid-column-end: 12;
  grid-row-start: 2;
  grid-row-end: 12;
  height: 90vh;
  padding: 2rem;
  justify-content: space-between;
}

.left-line-home {
  position: absolute;
  left: 0%;
  top: 5%;
  transform: translateY(-0%);
  opacity: 1;
  width: 1px;
  height: 0;
  background-color: #f7f7f7;
}

.explore-button-padding {
  padding-inline: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
