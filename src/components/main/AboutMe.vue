<script setup></script>
<template>
  <section class="about-me-container">
    <h3 ref="titleRef" class="title">About Me:</h3>
    <div class="about-me">
      <p>
        I am a passionate creative developer with a strong background in creating
        interactive experiences on the web using 3D scenes, GPU image manipulations,
        micro-interactions, and well craft animations. My expertise lies in Vue.js,
        JavaScript, CSS, Three.js and GSAP.
      </p>
      <p>
        In my free time, I enjoy contributing to open-source projects, teaching creating
        content and staying updated with the latest trends in web development. Out side software development, I love cooking, traveling, and spending time with my family.
      </p>
    </div>
  </section>
</template>
<style scoped lang="scss">
.about-me-container {
  padding: 1rem 0;
}
.title {
  font-size: 2rem;
  color: var(--white);
  padding: 4rem 0;
  text-align: center;
}
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
