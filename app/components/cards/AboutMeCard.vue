<script setup>
import { nextTick, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { showText } from "@/utils/gsaps.js";
import { prefersReducedMotion } from "@/utils/motion.js";
import RRSS from "@/components/common/RRSS.vue";
import SignatureJT from "@/assets/icons/SignatureJT.vue";
import CloseButton from "@/components/common/CloseButton.vue";
import { site, person } from "#shared/profile";
gsap.registerPlugin(SplitText);

const emit = defineEmits(["close"]);

const titleRef = ref(null);
const subTitleRef = ref(null);
const firstTextRef = ref(null);
const secondTextRef = ref(null);
const perfilRef = ref(null);
const imgContainerRef = ref(null);
const imgReady = ref(false);
let firstTextSplit = null;
let secondTextSplit = null;

const revealImage = () => {
  if (!imgContainerRef.value) return;
  if (prefersReducedMotion()) {
    gsap.set(imgContainerRef.value, { opacity: 1, scale: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    imgContainerRef.value,
    { opacity: 0, scale: 0.5, y: 50 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      transformOrigin: "50% 50%",
      ease: "power2.out",
    }
  );
};

const onImgLoad = () => {
  if (imgReady.value) return;
  imgReady.value = true;
  revealImage();
};

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
  if (prefersReducedMotion()) {
    // Reverting restores the original markup, so the copy reads normally.
    firstTextSplit.revert();
    secondTextSplit.revert();
    firstTextSplit = null;
    secondTextSplit = null;
    return;
  }
  gsap.from(lines, {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 0.75,
    delay: 0.25,
    ease: "power2.out",
    onComplete: () => {
      firstTextSplit?.revert();
      secondTextSplit?.revert();
      firstTextSplit = null;
      secondTextSplit = null;
    },
  });
};

onMounted(() => {
  playAnimation();
  if (perfilRef.value?.complete && perfilRef.value.naturalWidth > 0) onImgLoad();
});
</script>
<template>
  <section class="container">
    <div class="glass3d">
      <CloseButton @click="emit('close')" />
      <div class="glass-content">
        <div ref="imgContainerRef" class="img-container" :class="{ 'is-ready': imgReady }">
          <img
            ref="perfilRef"
            src="/img/Foto_Perfil.png"
            :alt="site.image.alt"
            width="547"
            height="456"
            decoding="async"
            fetchpriority="high"
            @load="onImgLoad"
          />
        </div>
        <div class="content-glass">
          <div class="overflow-hidden">
            <h2 ref="titleRef" class="is-size-1 has-text-light">{{ person.name }}</h2>
            <p ref="subTitleRef" class="is-size-2 has-text-light">{{ person.jobTitle }}</p>
          </div>
          <p ref="firstTextRef" class="text-container">{{ person.bio[0] }}</p>
          <p ref="secondTextRef">{{ person.bio[1] }}</p>
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
    position: fixed;
    top: 5%;
    left: 0;
    transform: translate(0, 0);
    min-height: 100vh;
    width: 100%;
    padding: 0 0.5rem;
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
  opacity: 0;
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
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-container.is-ready::after {
  opacity: 1;
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
</style>
<style scoped src="./GlassCard.css"></style>
