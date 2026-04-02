<script setup>
import theExperience from "@/components/webgl/theExperience.vue";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import Menu from "@/components/theMenu.vue";
</script>

<template>
  <Suspense>
    <LoadingScreen />
  </Suspense>
  <Menu />
  <Suspense>
    <theExperience />
  </Suspense>
</template>
