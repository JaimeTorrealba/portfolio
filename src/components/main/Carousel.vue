<script setup>
import { ref, onMounted } from "vue";
import rough from "roughjs";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText, ScrollTrigger, Draggable, InertiaPlugin);

const titleRef = ref(null);
const carouselRef = ref(null);
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

  const rc = rough.canvas(document.getElementById("carouselCanvas"));
  rc.line(20, 130, 290, 130, { stroke: "white" });
  gsap.from(carouselRef.value, {
    scrollTrigger: carouselRef.value,
    duration: 1,
    delay: 0.5,
    opacity: 0,
  });

  // Carousel
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
    inertia: {
      y: () => {},
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
  <section>
    <div class="overflow-hidden-y title-padding relative">
      <h3 ref="titleRef" class="title">Experience</h3>
      <canvas id="carouselCanvas" class="canvas" width="300" height="200"></canvas>
    </div>
    <div ref="carouselRef" class="carousel">
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
