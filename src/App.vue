<script setup>
import { RouterView } from 'vue-router'
import { useMainStore } from '@/stores'
import theExperience from '@/components/webgl/theExperience.vue'
import MusicButton from '@/components/common/MusicButton.vue';
import WordsHK from '@/components/misc/WordsHK.vue'

const store = useMainStore()

// TODO transition in loading screen
// TODO transition in content about and mobile
// TODO eliminar radix
</script>

<template>
  <WordsHK :wordsIndex="store.HKWordsIndex" />
  <Suspense>
    <theExperience />
  </Suspense>
  <MusicButton v-if="store.finishLoading && !store.showFirstPage" />
  <div class="version" v-if="store.finishLoading">
    <pre>Version 3.1.0</pre>
  </div>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<style scoped>
#HKText {
  position: fixed;
  top: 1%;
  left: 50%;
  z-index: 1000;
  color: white;
  font-size: 1.5rem;
}

.version {
  position: fixed;
  bottom: 1%;
  left: 1%;
  background-color: rgba(1, 1, 1, 0.5);
  color: white;
  font-size: 0.75rem;

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