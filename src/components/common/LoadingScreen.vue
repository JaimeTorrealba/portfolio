<script setup>
import { onMounted, nextTick } from "vue";
import { gsap } from "gsap";
import { useMainStore } from "@/stores";
import Azathoth from "@/assets/icons/Lovecraft/Azathoth.vue";

const store = useMainStore();

onMounted(async () => {
  await nextTick();
  gsap.from(["#innerText", "#secondText", "#outerText"], {
    duration: 3,
    opacity: 0,
  });
  gsap.to("#innerText", {
    duration: 40,
    rotate: 360,
    ease: "none",
    repeat: -1,
  });
  gsap.to("#secondText", {
    duration: 50,
    delay: 0.5,
    rotate: -360,
    ease: "none",
    repeat: -1,
  });
  gsap.to("#outerText", {
    duration: 50,
    delay: 0.5,
    rotate: 360,
    ease: "none",
    repeat: -1,
  });
});
</script>
<template>
  <Transition mode="out-in">
    <div v-if="!store.finishLoading" class="perfect-center">
      <div class="relative">
        <div class="flex flex-center-column flex-column">
          <Azathoth id="Azathoth" width="92" height="92" />
        </div>
        <svg
          class="center-svg-inner"
          id="innerText"
          width="250%"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <path
              d="M 437.66 250 C 437.66 301.785 416.628 348.763 382.696 382.696 C 348.763 416.628 301.785 437.66 250 437.66 C 198.215 437.66 151.237 416.628 117.304 382.696 C 83.372 348.763 62.34 301.785 62.34 250 C 62.34 198.215 83.372 151.237 117.304 117.304 C 151.237 83.372 198.215 62.34 250 62.34 C 301.785 62.34 348.763 83.372 382.696 117.304 C 416.628 151.237 437.66 198.215 437.66 250 Z M 381.989 118.011 C 348.182 84.205 301.581 63.34 250 63.34 C 198.419 63.34 151.818 84.205 118.011 118.011 C 84.205 151.818 63.34 198.419 63.34 250 C 63.34 301.581 84.205 348.182 118.011 381.989 C 151.818 415.795 198.419 436.66 250 436.66 C 301.581 436.66 348.182 415.795 381.989 381.989 C 415.795 348.182 436.66 301.581 436.66 250 C 436.66 198.419 415.795 151.818 381.989 118.011 Z"
              style=""
              id="path-0"
            ></path>
          </defs>
          <text
            style="
              fill: #f7f7f7;
              filter: blur(2px);
              font-family: 'Comic Sans MS';
              font-size: 48px;
              font-weight: 700;
              white-space: pre;
            "
            y="195.63"
            x="134.492"
          >
            <textPath startOffset="0" xlink:href="#path-0">
              Loading - Cargando - Caricando
            </textPath>
          </text>
        </svg>
        <svg
          class="center-svg-second"
          id="secondText"
          width="400%"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <path
              d="M 437.66 250 C 437.66 301.785 416.628 348.763 382.696 382.696 C 348.763 416.628 301.785 437.66 250 437.66 C 198.215 437.66 151.237 416.628 117.304 382.696 C 83.372 348.763 62.34 301.785 62.34 250 C 62.34 198.215 83.372 151.237 117.304 117.304 C 151.237 83.372 198.215 62.34 250 62.34 C 301.785 62.34 348.763 83.372 382.696 117.304 C 416.628 151.237 437.66 198.215 437.66 250 Z M 381.989 118.011 C 348.182 84.205 301.581 63.34 250 63.34 C 198.419 63.34 151.818 84.205 118.011 118.011 C 84.205 151.818 63.34 198.419 63.34 250 C 63.34 301.581 84.205 348.182 118.011 381.989 C 151.818 415.795 198.419 436.66 250 436.66 C 301.581 436.66 348.182 415.795 381.989 381.989 C 415.795 348.182 436.66 301.581 436.66 250 C 436.66 198.419 415.795 151.818 381.989 118.011 Z"
              style=""
              id="path-0"
            ></path>
          </defs>
          <text
            style="
              fill: #f7f7f7;
              filter: blur(2px);
              font-family: 'Comic Sans MS';
              font-size: 64px;
              font-weight: 700;
              white-space: pre;
            "
            y="195.63"
            x="134.492"
          >
            <textPath startOffset="127" xlink:href="#path-0">Creative developer</textPath>
          </text>
        </svg>
        <svg
          class="center-svg-outer"
          id="outerText"
          width="550%"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <path
              d="M 437.66 250 C 437.66 301.785 416.628 348.763 382.696 382.696 C 348.763 416.628 301.785 437.66 250 437.66 C 198.215 437.66 151.237 416.628 117.304 382.696 C 83.372 348.763 62.34 301.785 62.34 250 C 62.34 198.215 83.372 151.237 117.304 117.304 C 151.237 83.372 198.215 62.34 250 62.34 C 301.785 62.34 348.763 83.372 382.696 117.304 C 416.628 151.237 437.66 198.215 437.66 250 Z M 381.989 118.011 C 348.182 84.205 301.581 63.34 250 63.34 C 198.419 63.34 151.818 84.205 118.011 118.011 C 84.205 151.818 63.34 198.419 63.34 250 C 63.34 301.581 84.205 348.182 118.011 381.989 C 151.818 415.795 198.419 436.66 250 436.66 C 301.581 436.66 348.182 415.795 381.989 381.989 C 415.795 348.182 436.66 301.581 436.66 250 C 436.66 198.419 415.795 151.818 381.989 118.011 Z"
              style=""
              id="path-0"
            ></path>
          </defs>
          <text
            style="
              fill: #f7f7f7;
              filter: blur(4px);
              font-family: 'Comic Sans MS';
              font-size: 64px;
              font-weight: 700;
              white-space: pre;
            "
            y="195.63"
            x="134.492"
          >
            <textPath startOffset="400" xlink:href="#path-0">Jaime Torrealba</textPath>
          </text>
        </svg>
      </div>
    </div>
  </Transition>
</template>
<style>
.perfect-center {
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100vw;
  position: absolute;
  background-color: #111;
  overflow: hidden;
  z-index: 1000;
}

.comic-sans {
  font-family: "Comic Sans MS";
  filter: blur(1px);
}

.center-svg-inner,
.center-svg-second,
.center-svg-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
}

.center-svg-inner {
  width: 40vmin;
}

.center-svg-second {
  width: 70vmin;
}

.center-svg-outer {
  width: 95vmin;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
