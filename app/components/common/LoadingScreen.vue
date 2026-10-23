<script setup>
import { onMounted, onUnmounted, nextTick, ref } from "vue";
import { useMainStore } from "@/stores";
import { prefersReducedMotion } from "@/utils/motion.js";
import { createLoaderClock } from "@/utils/spiralLoader/clock.js";
// Centre icon commented out while the sound choice sits in the middle of the loader.
// import Azathoth from "@/assets/icons/Lovecraft/Azathoth.vue";

const store = useMainStore();
const foregroundRef = ref(null);

// Each ring and the direction it spins in.
const RING_SPINS = [
  // Inner "Loading" ring commented out: it overlapped the sound choice.
  // { id: "innerText", dir: 1 },
  { id: "secondText", dir: -1 },
  { id: "outerText", dir: 1 },
];

// One clock drives every loader value (see utils/spiralLoader). It is stopped once the
// exit has played, or on unmount, so nothing keeps animating detached nodes.
let loaderClock = null;
const stopLoaderClock = () => {
  loaderClock?.stop();
  loaderClock = null;
};
onUnmounted(stopLoaderClock);

const revealMenu = () => {
  store.loaderAlmostGone = true;
};

// Vue keeps the loader in the DOM until `done`, so the whole exit plays out. The menu is
// cued near the end of it; without a clock there is no exit, so it is cued on removal.
const playLoaderExit = (el, done) =>
  loaderClock ? loaderClock.playExit(el, done, revealMenu) : done();

const onLoaderRemoved = () => {
  stopLoaderClock();
  revealMenu();
};

const collectRings = () =>
  RING_SPINS.map(({ id, dir }) => {
    const svg = document.getElementById(id);
    return { svg, text: svg.querySelector("text"), dir };
  });

onMounted(async () => {
  await nextTick();
  // Loading may already be done, in which case the rings were never rendered and there
  // is no exit to wait for.
  if (!document.getElementById(RING_SPINS[0].id)) return revealMenu();
  loaderClock = createLoaderClock({
    rings: collectRings(),
    foreground: foregroundRef.value,
    reducedMotion: prefersReducedMotion(),
  });
  loaderClock.start();
});
</script>
<template>
  <Transition mode="out-in" :css="false" @leave="playLoaderExit" @after-leave="onLoaderRemoved">
    <div v-if="!store.sceneRevealed" class="perfect-center" role="status">
      <span class="visually-hidden">Loading</span>
      <!-- Decorative: the ring text would otherwise be read out in three languages. -->
      <div aria-hidden="true">
        <div ref="foregroundRef">
          <!-- <Azathoth id="Azathoth" width="92" height="92" /> -->
        </div>
        <!-- Commented out with the inner ring in RING_SPINS above.
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
              id="ring-path-inner"
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
            <textPath startOffset="0" xlink:href="#ring-path-inner">
              Loading - Cargando - Caricando
            </textPath>
          </text>
        </svg>
        -->
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
              id="ring-path-second"
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
            <textPath startOffset="127" xlink:href="#ring-path-second">Creative developer</textPath>
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
              id="ring-path-outer"
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
            <textPath startOffset="400" xlink:href="#ring-path-outer">Jaime Torrealba</textPath>
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
  /* Above the canvas (fixed, no z-index) but below the cards (10), the sound choice (20)
     and the sound toggle (100): the choice is made on top of this screen. */
  z-index: 5;
}

.center-svg-inner,
.center-svg-second,
.center-svg-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  /* Own layer: the blurred text is rasterised once and the spin is composited, instead
     of being repainted every frame while the scene is compiling. */
  will-change: transform;
}

/* The loader is in the prerendered HTML, so without this the rings would show at full
   opacity until the JS loads, then vanish and fade back in. Under reduced motion there is
   no fade, so they keep their normal opacity. */
@media (prefers-reduced-motion: no-preference) {
  .center-svg-inner,
  .center-svg-second,
  .center-svg-outer {
    opacity: 0;
  }
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
</style>
