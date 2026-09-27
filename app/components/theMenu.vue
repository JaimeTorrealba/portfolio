<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "@/stores";
import { prefersReducedMotion } from "@/utils/motion.js";
import AboutMeCard from "@/components/cards/AboutMeCard.vue";
import ContentCard from "@/components/cards/ContentCard.vue";
import ExperienceCard from "@/components/cards/ExperienceCard.vue";

const store = useMainStore();
const showAboutMeCard = ref(false);
const showContentCard = ref(false);
const showExperienceCard = ref(false);

const { width } = useWindowSize();
watch(width, () => {
  showAboutMeCard.value = false;
  showContentCard.value = false;
  showExperienceCard.value = false;
});

const onEnter = (el, done) => {
  if (prefersReducedMotion()) {
    gsap.set(el, { scale: 1, y: 0 });
    done();
    return;
  }
  gsap.fromTo(
    el,
    { scale: 0.88, y: 48 },
    { scale: 1, y: 0, duration: 0.65, ease: "power3.out", onComplete: done }
  );
};

const onLeave = (el, done) => {
  if (prefersReducedMotion()) {
    done();
    return;
  }
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
  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, scale: 1, y: 0 });
    done();
    return;
  }
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
  if (prefersReducedMotion()) {
    done();
    return;
  }
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
    <ContentCard v-if="showContentCard" @close="showContentCard = false" />
  </Transition>

  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <ExperienceCard v-if="showExperienceCard" @close="showExperienceCard = false" />
  </Transition>

  <TransitionGroup
    :css="false"
    @enter="onBtnEnter"
    @leave="onBtnLeave"
    tag="div"
    class="btn-group"
  >
    <button
      v-if="
        store.finishLoading && !showAboutMeCard && !showContentCard && !showExperienceCard
      "
      key="about"
      data-index="0"
      class="menu-btn"
      @click="showAboutMeCard = true"
      aria-label="Open profile card"
    >
      About me
    </button>
    <button
      v-if="
        store.finishLoading && !showAboutMeCard && !showContentCard && !showExperienceCard
      "
      key="content"
      data-index="1"
      class="menu-btn"
      @click="showContentCard = true"
      aria-label="Open content card"
    >
      Content
    </button>
    <button
      v-if="
        store.finishLoading && !showAboutMeCard && !showContentCard && !showExperienceCard
      "
      key="experience"
      data-index="2"
      class="menu-btn"
      @click="showExperienceCard = true"
      aria-label="Open experience card"
    >
      Experience
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
