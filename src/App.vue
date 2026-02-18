<script setup>
import theExperience from "@/components/webgl/theExperience.vue";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import Card from "@/components/common/Card.vue";
</script>

<template>
  <Suspense>
    <LoadingScreen />
  </Suspense>
  <Card />
  <Suspense>
    <theExperience />
  </Suspense>
</template>
