<script setup>
import { RouterView } from 'vue-router'
import { useMainStore } from '@/stores'
import theExperience from '@/components/webgl/theExperience.vue'
import MusicButton from '@/components/common/MusicButton.vue';

const store = useMainStore()

// TODO transition in loading screen
// TODO transition in content about and mobile
// TODO eliminar radix
</script>

<template>
  <router-view v-slot="{ Component }">
    <main class="container">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </main>
  </router-view>
  <Suspense>
    <theExperience />
  </Suspense>
  <MusicButton v-if="store.finishLoading" />
  <div class="version" v-if="store.finishLoading">
    <pre>Version 3.1.0</pre>
  </div>

</template>
<style>
.container {
  display: grid;
  min-block-size: 100vb;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, auto);
  gap: 0.5rem;
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