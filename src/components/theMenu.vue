<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "@/stores";
import AboutMeCard from "@/components/cards/AboutMeCard.vue";
import TalksCard from "@/components/cards/TalksCard.vue";

const store = useMainStore();
const showAboutMeCard = ref(false);
const showTalksCard = ref(false);

const { width } = useWindowSize();
watch(width, () => {
  showAboutMeCard.value = false;
  showTalksCard.value = false;
});

const onEnter = (el, done) => {
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.88, y: 48 },
    { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out", onComplete: done }
  );
};

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    scale: 0.92,
    y: 32,
    duration: 0.15,
    ease: "power2.in",
    onComplete: done,
  });
};

const onBtnEnter = (el, done) => {
  const index = parseInt(el.dataset.index || "0");
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.7, y: 24 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      delay: index * 0.12,
      ease: "power3.out",
      onComplete: done,
    }
  );
};

const onBtnLeave = (el, done) => {
  const index = parseInt(el.dataset.index || "0");
  gsap.to(el, {
    opacity: 0,
    scale: 0.85,
    y: 16,
    duration: 0.2,
    delay: index * 0.06,
    ease: "power2.in",
    onComplete: done,
  });
};
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <AboutMeCard v-if="showAboutMeCard" @close="showAboutMeCard = false" />
  </Transition>

  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <TalksCard v-if="showTalksCard" @close="showTalksCard = false" />
  </Transition>

  <TransitionGroup
    :css="false"
    @enter="onBtnEnter"
    @leave="onBtnLeave"
    tag="div"
    class="btn-group"
  >
    <button
      v-if="store.finishLoading && !showAboutMeCard && !showTalksCard"
      key="about"
      data-index="0"
      class="menu-btn"
      @click="showAboutMeCard = true"
      aria-label="Open profile card"
    >
      About me
    </button>
    <button
      v-if="store.finishLoading && !showAboutMeCard && !showTalksCard"
      key="talks"
      data-index="1"
      class="menu-btn"
      @click="showTalksCard = true"
      aria-label="Open talks card"
    >
      Talks
    </button>
  </TransitionGroup>
</template>

<style scoped>
.btn-group {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.menu-btn {
  color: var(--white);
  font-family: "sentient";
  font-size: calc(1.125rem * 1.5);
  border-radius: 0.75rem;
  background-color: transparent;
}
</style>
