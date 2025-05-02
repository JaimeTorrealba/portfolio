<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const titleRef = ref(null);
onMounted(() => {
  gsap.from(titleRef.value, {
    duration: 1,
    y: 250,
  });
});
</script>
<template>
  <section class="about-me-container">
    <div class="overflow-hidden-y">
        <h1 ref="titleRef" class="title">My projects</h1>
    </div>
    <div class="video">
      <div class="debug"></div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.debug {
  width: 75%;
  min-height: 75vh;
  border: 1px solid red;
  border-radius: 1rem;
  padding: 1rem;
  margin: 0 auto;
}
</style>
