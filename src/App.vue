<script setup>
import theExperience from '@/components/webgl/theExperience.vue'
import { RouterView } from 'vue-router'
// TODO add copyrights
// TODO transition between pages
// TODO transition in loading screen
// MUSIC and music button in second screen home
</script>

<template>
  <Suspense>
    <theExperience />
  </Suspense>
  <RouterView />
</template>