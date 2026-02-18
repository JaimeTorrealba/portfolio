<script setup>
import { nextTick, watchEffect, ref, computed } from "vue";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "@/stores";
import { showText } from "@/utils/gsaps.js";
import GlassSurface from "@/components/common/GlassSurface.vue";
import RRSS from "@/components/common/RRSS.vue";
import SignatureJT from "@/assets/icons/SignatureJT.vue";
gsap.registerPlugin(SplitText);

const store = useMainStore();
const { width } = useWindowSize();

const cardWidth = computed(() => Math.max(width.value / 2, 400));

const titleRef = ref(null);
const subTitleRef = ref(null);
const firstTextRef = ref(null);
const secondTextRef = ref(null);
const perfilRef = ref(null);

const playAnimation = async () => {
  await nextTick();
  const master = gsap.timeline();
  master.add(showText(titleRef.value));
  master.add(showText(subTitleRef.value), "-=0.5");
  const firstText = SplitText.create(firstTextRef.value, {
    type: "lines",
  });
  const secondText = SplitText.create(secondTextRef.value, {
    type: "lines",
  });
  const lines = [firstText.lines, secondText.lines].flat();
  gsap.from(lines, {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    delay: 0.5,
    ease: "power2.out",
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
    <GlassSurface
      :width="cardWidth"
      :height="400"
      :border-radius="16"
      :border-width="0.1"
      :displace="2"
      :background-opacity="0.25"
      style="custom-style"
    >
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
            Creative developer with a strong background in creating interactive
            experiences on the web using 3D scenes, GPU image manipulations,
            micro-interactions, and well craft animations.
          </p>
          <p ref="secondTextRef">
            I love using Vue.js, JavaScript, CSS, Three.js and GSAP.
          </p>
        </div>
        <span class="signature">
          <SignatureJT />
        </span>
        <RRSS class="rrss" />
      </div>
    </GlassSurface>
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
</style>
