<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const titleRef = ref(null);
const descriptionRef = ref(null);
onMounted(() => {
  gsap.from(titleRef.value, {
    scrollTrigger: titleRef.value,
    duration: 1,
    y: 250,
  });
  document.fonts.ready.then(() => {
    const firstText = SplitText.create(descriptionRef.value.children[0], {
      type: "lines",
    });
    const secondText = SplitText.create(descriptionRef.value.children[1], {
      type: "lines",
    });
    const lines = [firstText.lines, secondText.lines].flat();
    gsap.from(lines, {
      scrollTrigger: titleRef.value,
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      delay: 0.5,
    });
  });
});
</script>
<template>
  <section>
    <div class="overflow-hidden-y">
      <h2 ref="titleRef" class="title">About Me</h2>
    </div>
    <div ref="descriptionRef" class="about-me">
      <p>
        I am a passionate creative developer with a strong background in creating
        interactive experiences on the web using 3D scenes, GPU image manipulations,
        micro-interactions, and well craft animations. My expertise lies in Vue.js,
        JavaScript, CSS, Three.js and GSAP.
      </p>
      <p>
        In my free time, I enjoy contributing to open-source projects, teaching creating
        content and staying updated with the latest trends in web development. Out side
        software development, I love cooking, traveling, and spending time with my family.
      </p>
    </div>
  </section>
</template>
<style scoped lang="scss">
.about-me {
  padding: 0 2rem;
  color: var(--white);
  font-size: 1.5rem;
  line-height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    max-width: 75ch;
    margin: 0 0 1.5rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
    line-height: 1.5rem;
  }
}
</style>
