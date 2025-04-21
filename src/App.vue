<script setup>
import { RouterView } from "vue-router";
import LoadingScreen from '@/components/common/LoadingScreen.vue';

// TODO transition in loading screen
// TODO transition in content about and mobile
// TODO eliminar radix
</script>

<template>
  <Suspense>
    <LoadingScreen />
  </Suspense>
  <main class="container">
    <router-view></router-view>
  </main>
</template>
<style scoped>
</style>
