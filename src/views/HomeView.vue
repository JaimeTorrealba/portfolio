<script setup>
import { nextTick, watchEffect, ref } from "vue";
import { gsap } from "gsap";
import { useMainStore } from "@/stores";
import { showText } from "@/utils/gsaps.js";
import theExperience from "@/components/webgl/theExperience.vue";
import LoadingScreen from '@/components/common/LoadingScreen.vue';

const store = useMainStore()

const titleRef = ref(null)
const descriptionRef = ref(null)

const playAnimation = async () => {
  await nextTick()
  const master = gsap.timeline()
  master.add(showText(titleRef.value))
  master.add(showText(descriptionRef.value), '-=0.5')
}

watchEffect(() => {
  if (store.finishLoading) {
    playAnimation()
  }
})

const onEnter = () => {
  store.isHovered = true
}

const onLeave = () => {
  store.isHovered = false
}
</script>

<template>
  <Suspense>
    <LoadingScreen />
  </Suspense>
  <div class="overflow-hidden p-4 z-10" v-if="store.finishLoading">
    <h1 ref="titleRef" class="is-size-1 has-text-light">Jaime Torrealba</h1>
    <h2 ref="descriptionRef" class="is-size-2 has-text-light">Creative developer</h2>
  </div>
  <Suspense>
    <theExperience />
  </Suspense>
  <div class="button p-4 custom-button" v-if="store.finishLoading" @mouseenter="onEnter" @mouseleave="onLeave">
   <router-link to="/main" class="has-text-light is-size-4"> Check  my portfolio</router-link>
  </div>
</template>
<style scoped>
.version {
  position: fixed;
  bottom: 1%;
  left: 1%;
  background-color: transparent;
  color: white;
  font-size: 0.75rem;
  z-index: 9999;
}
.z-10 {
  position: relative;
  z-index: 10;
}
.custom-button{
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  border: 1px solid white;
  z-index: 9999;
  &:hover {
    background-color: #fff;
    a {
      color: #111 !important;
    }
  }
}

</style>
