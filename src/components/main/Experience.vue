<script setup>
import { ref, onMounted } from "vue";
import rough from "roughjs";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Azathoth from "@/assets/icons/Lovecraft/Azathoth.vue";
import Ripley from "./CarouselCards/Ripley.vue";
import Coaniquem from "./CarouselCards/Coaniquem.vue";
import Lemu from "./CarouselCards/Lemu.vue";
import Push from "./CarouselCards/Push.vue";
import Sky from "./CarouselCards/Sky.vue";
import Tres from "./CarouselCards/Tres.vue";

gsap.registerPlugin(SplitText, ScrollTrigger, Draggable, InertiaPlugin);

const titleRef = ref(null);
const carouselRef = ref(null);
const currentElement = ref("Push");

const elementsMap = {
  Ripley,
  Coaniquem,
  Lemu,
  Push,
  Sky,
  Tres,
};

onMounted(async () => {
  await document.fonts.ready;
  const title = SplitText.create(titleRef.value, {
    type: "chars",
  });
  gsap.from(title.chars, {
    duration: 0.75,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: titleRef.value,
      start: "top 80%",
      // markers: true, // TODO: debug this
    },
  });

  const rc = rough.canvas(document.getElementById("carouselCanvas"));
  rc.rectangle(5, 0, 250, 55, { stroke: "white" });

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
    // Detect which slide is in front
    function getFrontSlide() {
      let frontIndex = -1;
      let minAngle = 9999;
      slides.forEach((slide, index) => {
        const style = window.getComputedStyle(slide);
        const transform = style.transform || style.webkitTransform;
        if (!transform || transform === "none") return;
        const values = transform.match(/matrix3d\(([^)]+)\)/);
        if (values) {
          const matrix = values[1].split(",").map(Number);
          // rotateX = Math.atan2(matrix[9], matrix[10]) in radians
          const rotateXRad = Math.atan2(matrix[9], matrix[10]);
          const rotateXDeg = rotateXRad * (180 / Math.PI);
          const normalized = ((rotateXDeg % 360) + 360) % 360;
          const angleToFront = Math.abs(normalized > 180 ? normalized - 360 : normalized);
          if (angleToFront < minAngle) {
            minAngle = angleToFront;
            frontIndex = index;
          }
        }
      });
      return frontIndex;
    }
    const frontIndex = getFrontSlide();
    if (frontIndex !== -1) {
      const splittedText = slides[frontIndex].textContent.split(" ");
      currentElement.value = splittedText[0];
    }
  }
});
</script>
<template>
  <section class="min-h-screen">
    <div class="overflow-hidden px-4 is-relative">
      <h3 ref="titleRef" id="experience" class="title is-flex is-align-items-center py-1"><Azathoth />  Experience</h3>
      <canvas id="carouselCanvas" class="canvas" width="300" height="200"></canvas>
    </div>
    <div ref="carouselRef" class="carousel my-6 radial-gradient">
      <ul>
        <li>Push Security</li>
        <li>Coaniquem</li>
        <li>Ripley</li>
        <li>Lemu</li>
        <li>Sky Airlines</li>
        <li>Tres js</li>
      </ul>
    </div>
    <div class="py-6">
      <transition mode="out-in" name="blur">
        <component :is="elementsMap[currentElement]" :key="currentElement" />
      </transition>
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

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  @media screen and (max-width: 500px) {
    display: none;
  }
}

.blur-enter-active,
.blur-leave-active {
  transition: all 0.25s;
}
.blur-enter-from,
.blur-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
