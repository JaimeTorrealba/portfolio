<script setup>
import { nextTick, watchEffect, ref } from "vue";
import { gsap } from "gsap";
import { useMainStore } from "@/stores";
import { showText } from "@/utils/gsaps.js";
import theExperience from "@/components/webgl/theExperience.vue";

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
</script>

<template>
  <div class="px-l overflow-none z-10" v-if="store.finishLoading">
    <h1 ref="titleRef" class="h1-large bloom-effect-tiny pa-s">Jaime <br />
      Torrealba</h1>
    <h2 ref="descriptionRef" class="h2 bloom-effect-tiny pa-s">Creative developer</h2>
  </div>
  <Suspense>
    <theExperience />
  </Suspense>
  <div class="version" v-if="store.finishLoading">
    <pre>Version 3.1.0</pre>
  </div>
</template>
<style scoped>
.version {
  position: fixed;
  bottom: 1%;
  left: 1%;
  background-color: rgba(1, 1, 1, 0.5);
  color: white;
  font-size: 0.75rem;
  z-index: 9999;
}
.z-10 {
  position: relative;
  z-index: 10;
}
</style>
