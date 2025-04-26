<script setup>
import { onMounted } from "vue";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

onMounted(() => {
  const slides = gsap.utils.toArray(".carousel li");
  const slidesCount = slides.length;
  const slideHeight = slides[0].offsetHeight;
  const circumFerence = slidesCount * slideHeight;
  const radius = circumFerence / (2 * Math.PI);

  gsap.set(".carousel", { height: `${2 * Math.round(radius)}px` });

  slides.forEach((slide, index) => {
    gsap.set(slide, {
      yPercent: -50,
      z: radius,
      y: radius,
      rotateX: `${(index * 360) / slidesCount}deg`,
      transformOrigin: `50% 50% -${radius}px`,
    });
  });

  const animation = gsap.to(slides, {
    rotateX: "-=360deg",
    ease: "none",
    paused: true,
  });

  const proxy = document.createElement("div");
  Draggable.create(proxy, {
    type: "y",
    trigger: ".carousel ul",
    snap: {
      y: (y) => Math.round(y / slideHeight) * circumFerence,
    },
    onDrag: updateProgress,
    onThrowUpdate: updateProgress,
  });

  const wrapValue = gsap.utils.wrap(0, slidesCount * slideHeight);

  function updateProgress() {
    animation.progress(wrapValue(this.y) / circumFerence);
  }
});
</script>
<template>
  <section class="carousel-container">
    <h3 ref="titleRef" class="title">Experience:</h3>
    <div class="carousel">
      <ul>
        <li>Coaniquem</li>
        <li>Ripley</li>
        <li>Lemu</li>
        <li>Sky Airlines</li>
        <li>Push Security</li>
      </ul>
    </div>
  </section>
</template>
<style scoped>
.title{
    font-size: 2rem;
    color: var(--white);
    padding: 4rem 0;
    text-align: center;
}
.carousel-container{
    padding: 1rem 0;
}
.carousel {
  width: 100%;
  position: relative;
  display: grid;
  place-content: center;
  perspective: 1800px;
  overflow: hidden;
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    li {
      text-align: center;
      white-space: nowrap;
      position: absolute;
      width: 100%;
      line-height: 6rem;
      font-size: 5rem;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      @media screen and (max-width: 768px) {
        font-size: 3rem;
        line-height: 4rem;
      }
    }
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    right: 0;
    left: 0;
    height: 22%;
    z-index: 1;
    pointer-events: none;
  }

}
</style>
