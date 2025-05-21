<script setup>
import { ref, onMounted } from "vue";
import rough from 'roughjs';
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const titleRef = ref(null);
onMounted(() => {
  const title = SplitText.create(titleRef.value, {
    type: "chars",
  });
  gsap.from(title.chars, {
    duration: 0.75,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
  });

  const rc = rough.canvas(document.getElementById('showReelCanvas'));
  rc.ellipse(150, 100, 280, 100, { stroke: 'white'});
});
</script>
<template>
  <section class="about-me-container">
    <div class="overflow-hidden-y title-padding relative">
        <h1 ref="titleRef" class="title">Showreel</h1>
        <canvas id="showReelCanvas" class="canvas" width="300" height="200"></canvas>
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

.canvas{
  position: absolute;
  top: 0;
  left: 0;
  @media screen and (max-width: 500px) {
    display: none;
  }
}

.title-padding{
  padding: 0 2rem;
    @media screen and (max-width: 500px) {
    padding: 0;
  }
}
</style>
