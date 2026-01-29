<script setup>
import { Precipitation } from "@tresjs/cientos";
import { useMainStore } from "@/stores";

// import Smoke from "./Smoke.vue";
// import Trees from "./Trees.vue";
// import Sound from "./Sound.vue";
// import Grass from "./Grass.vue";

const store = useMainStore();

// Loads
// const { map: startParticle } = await useTexture({ map: "/textures/startParticle.png" });


</script>
<template>
  <TresFog color="#111" near="8" far="100" />
  <!-- <Sound /> -->
  <Precipitation
    :rotate-x="Math.PI * -0.5"
    :position="[0, 10, 10]"
    :area="[30, 30, 30]"
    :randomness="0"
    :count="100"
    :size="0.15"
    :color="0xffd700"
    :speed="store.isHovered ? 0.1 : 0.5"
    :opacity="0.8"
    :transparent="true"
    :alphaMap="startParticle"
  />

  <!-- <Trees /> -->
  <!-- <Suspense> -->
    <!-- <Smoke /> -->
  <!-- </Suspense> -->
  <!-- <Grass /> -->
</template>
