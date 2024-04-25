<script setup>
import { useMainStore } from "@/stores";
import FirstScreen from '@/components/home/FirstScreen.vue'
import SecondScreen from '@/components/home/SecondScreen.vue'

const store = useMainStore()

const handleNextScreen = (e) => {
  store.showFirstPage = e
  if (!e) {
    store.musicInstance.play()
  }

}
</script>

<template>
  <main class="container">
    <Transition name="fade" mode="out-in">
      <FirstScreen @first-screen="handleNextScreen" :firstScreen="store.showFirstPage" v-if="store.showFirstPage" />
    </Transition>
    <Transition name="fade" mode="out-in">
      <SecondScreen @first-screen="handleNextScreen" :firstScreen="store.showFirstPage" v-if="!store.showFirstPage" />
    </Transition>
  </main>
</template>
<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
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
