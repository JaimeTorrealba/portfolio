<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";
import { useWindowSize } from "@vueuse/core";
import { useMainStore } from "@/stores";
import AboutMeCard from "@/components/common/AboutMeCard.vue";

const store = useMainStore();
const showAboutMeCard = ref(false);

const { width } = useWindowSize();
watch(width, () => {
  showAboutMeCard.value = false;
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
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <AboutMeCard v-if="showAboutMeCard" @close="showAboutMeCard = false" />
  </Transition>

  <Transition name="btn-fade">
    <button
      v-if="store.finishLoading && !showAboutMeCard"
      class="menu-btn"
      @click="showAboutMeCard = true"
      aria-label="Open profile card"
    >
      About me
    </button>
  </Transition>
</template>

<style scoped>
.menu-btn {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  color: var(--white);
  font-family: 'sentient';
  font-size: calc(1.125rem * 1.5);
  border-radius: 0.75rem;
  background-color: transparent;
}

/* Button fade transition */
.btn-fade-enter-active,
.btn-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.btn-fade-enter-from,
.btn-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.7);
}

.btn-fade-enter-to,
.btn-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
</style>
