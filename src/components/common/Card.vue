<script setup>
import { nextTick, watchEffect, ref } from "vue";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useMainStore } from "@/stores";
import { showText } from "@/utils/gsaps.js";
import RRSS from "@/components/common/RRSS.vue";
import SignatureJT from "@/assets/icons/SignatureJT.vue";
gsap.registerPlugin(SplitText);

const store = useMainStore();

const titleRef = ref(null);
const subTitleRef = ref(null);
const firstTextRef = ref(null);
const secondTextRef = ref(null);
const perfilRef = ref(null);
let firstTextSplit = null;
let secondTextSplit = null;

const playAnimation = async () => {
  await nextTick();
  firstTextSplit?.revert();
  secondTextSplit?.revert();
  const master = gsap.timeline();
  master.add(showText(titleRef.value));
  master.add(showText(subTitleRef.value), "-=0.5");
  firstTextSplit = SplitText.create(firstTextRef.value, {
    type: "lines",
  });
  secondTextSplit = SplitText.create(secondTextRef.value, {
    type: "lines",
  });
  const lines = [firstTextSplit.lines, secondTextSplit.lines].flat();
  gsap.from(lines, {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    delay: 0.5,
    ease: "power2.out",
    onComplete: () => {
      firstTextSplit?.revert();
      secondTextSplit?.revert();
      firstTextSplit = null;
      secondTextSplit = null;
    },
  });
  gsap.from(perfilRef.value, {
    duration: 0.5,
    delay: 0.5,
    opacity: 0,
    transformOrigin: "50% 50%",
    scale: 0.5,
    y: 50,
    ease: "power2.out",
  });
};

watchEffect(() => {
  if (store.finishLoading) {
    playAnimation();
  }
});
</script>
<template>
  <section v-if="store.finishLoading" class="container">
    <div class="glass3d">
      <div class="glass-content">
        <div class="img-container">
          <img ref="perfilRef" src="/img/Foto_Perfil.png" alt="Image of my face" />
        </div>
        <div class="content-glass">
          <div class="overflow-hidden">
            <h1 ref="titleRef" class="is-size-1 has-text-light">Jaime Torrealba</h1>
            <h2 ref="subTitleRef" class="is-size-2 has-text-light">Creative developer</h2>
          </div>
          <p ref="firstTextRef" class="text-container">
            Creative developer focused on immersive web experiences, real-time 3D, micro-interactions and
            expressive animations.
          </p>
          <p ref="secondTextRef">
            I enjoy blending design and code using Vue.js, Three.js, Tres.js, and GSAP.
          </p>
        </div>
        <span class="signature">
          <SignatureJT />
        </span>
        <RRSS class="rrss" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.container {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  overflow: visible;
  width: 50%;
  @media screen and (max-width: 1024px) {
    display: grid;
    place-items: center;
    position: relative;
    top: 0;
    left: 0;
    transform: translate(0, 0);
    min-height: 100vh;
    width: 100%;
    margin: 0.5rem;
  }
}

.glass-content {
  display: grid;
  grid-template-areas:
    "img content"
    "rrss rrss";
  grid-template-columns: 0.5fr 1fr;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 1rem;
  overflow: visible;
  @media screen and (max-width: 1280px) {
    grid-template-areas:
      "content content"
      "rrss rrss";
  }
}

.img-container {
  grid-area: img;
  border-radius: 0.75rem;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  img {
    display: block;
    border-radius: 0.75rem;
    width: 100%;
    max-width: 325px;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
  @media screen and (max-width: 1280px) {
    display: none;
  }
}

.img-container::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 15%;
  border-radius: inherit;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  pointer-events: none;
}

.rrss {
  grid-area: rrss;
  width: 100%;
}

.content-glass {
  grid-area: content;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 1rem;
  width: 100%;
  height: 100%;
}

.text-container {
  margin-top: 1rem;
  position: relative;
}
.signature {
  position: absolute;
  bottom: -10%;
  right: -5%;
  @media screen and (max-width: 1280px) {
    display: none;
  }
}

.container :deep(.glass-surface) {
  overflow: visible;
}

.overflow-hidden {
  overflow: hidden;
}

.glass3d {
  --filter-glass3d: blur(8px) brightness(0.4) saturate(1.5);
  --color-glass3d: hsl(189 80% 10% / 0.2);
  border-radius: 1rem;
  min-width: 400px;
  border: 1px solid hsla(0, 0%, 35%, 0.5);

  position: relative;
  z-index: 4;
  box-shadow: 0 0 0.75px hsl(205 20% 10% / 0.2),
    0.7px 0.8px 1.2px -0.4px hsl(205 20% 10% / 0.1),
    1.3px 1.5px 2.2px -0.8px hsl(205 20% 10% / 0.1),
    2.3px 2.6px 3.9px -1.2px hsl(205 20% 10% / 0.1),
    3.9px 4.4px 6.6px -1.7px hsl(205 20% 10% / 0.1),
    6.5px 7.2px 10.9px -2.1px hsl(205 20% 10% / 0.1),
    8px 9px 14px -2.5px hsl(205 20% 10% / 0.2);
}

.glass3d {
  --filter-glass3d: blur(8px) brightness(0.4) saturate(1.5);
  --color-glass3d: hsl(189 80% 10% / 0.2);

  position: relative;
  z-index: 4;
  box-shadow: 0 0 0.75px hsl(205 20% 10% / 0.2),
    0.7px 0.8px 1.2px -0.4px hsl(205 20% 10% / 0.1),
    1.3px 1.5px 2.2px -0.8px hsl(205 20% 10% / 0.1),
    2.3px 2.6px 3.9px -1.2px hsl(205 20% 10% / 0.1),
    3.9px 4.4px 6.6px -1.7px hsl(205 20% 10% / 0.1),
    6.5px 7.2px 10.9px -2.1px hsl(205 20% 10% / 0.1),
    8px 9px 14px -2.5px hsl(205 20% 10% / 0.2);
}

.glass3d::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 3;

  -webkit-backdrop-filter: var(--filter-glass3d);
  backdrop-filter: var(--filter-glass3d);
}

.glass3d::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 5;

  box-shadow: inset 2px 2px 1px -3px hsl(205 20% 90% / 0.8),
    inset 4px 4px 2px -6px hsl(205 20% 90% / 0.3),
    inset 1.5px 1.5px 1.5px -0.75px hsl(205 20% 90% / 0.15),
    inset 1.5px 1.5px 0.25px hsl(205 20% 90% / 0.03),
    inset 0 0 0.25px 0.5px hsl(205 20% 90% / 0.03);
}

.glass3d > * {
  position: relative;
  z-index: 6;
}
</style>
