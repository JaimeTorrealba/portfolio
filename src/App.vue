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
</template>
<style scoped>


</style>
