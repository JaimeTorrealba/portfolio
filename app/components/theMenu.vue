<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { useWindowSize, useEventListener } from "@vueuse/core";
import { useMainStore } from "@/stores";
import { prefersReducedMotion } from "@/utils/motion.js";
import AboutMeCard from "@/components/cards/AboutMeCard.vue";
import ContentCard from "@/components/cards/ContentCard.vue";
import ExperienceCard from "@/components/cards/ExperienceCard.vue";

// Longest a visitor waits for the scene before the menu shows anyway, counted from page
// load rather than from this component's mount.
const MENU_MAX_WAIT_MS = 2500;

const store = useMainStore();
const showAboutMeCard = ref(false);
const showContentCard = ref(false);
const showExperienceCard = ref(false);

const showMenuButtons = computed(
  () =>
    store.menuReady &&
    !showAboutMeCard.value &&
    !showContentCard.value &&
    !showExperienceCard.value
);
// Only when the cap was hit: tells the visitor the menu works while the scene loads.
const showLoadingNote = computed(() => showMenuButtons.value && !store.finishLoading);

let menuWaitTimer = null;
onMounted(() => {
  menuWaitTimer = setTimeout(() => {
    store.menuWaitExpired = true;
  }, Math.max(0, MENU_MAX_WAIT_MS - performance.now()));
});
onUnmounted(() => clearTimeout(menuWaitTimer));

const closeAllCards = () => {
  showAboutMeCard.value = false;
  showContentCard.value = false;
  showExperienceCard.value = false;
};

const { width } = useWindowSize();
watch(width, closeAllCards);

useEventListener(document, "keydown", (event) => {
  if (event.key === "Escape") closeAllCards();
});

const onEnter = (el, done) => {
  if (prefersReducedMotion()) {
    gsap.set(el, { scale: 1, y: 0 });
    done();
    return;
  }
  // The card's blurred glass sits over a canvas that redraws every frame. Promoting it
  // to its own layer for the scale-in lets the compositor move it instead of repainting
  // it each frame; dropped afterwards so an open card does not hold the layer.
  el.style.willChange = "transform";
  gsap.fromTo(
    el,
    { scale: 0.88, y: 48 },
    {
      scale: 1,
      y: 0,
      duration: 0.65,
      ease: "power3.out",
      onComplete: () => {
        el.style.willChange = "";
        done();
      },
    }
  );
};

const onLeave = (el, done) => {
  if (prefersReducedMotion()) {
    done();
    return;
  }
  // Same layer promotion as onEnter; the element is removed when this finishes.
  el.style.willChange = "transform";
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
      v-if="showMenuButtons"
      key="about"
      data-index="0"
      class="menu-btn"
      @click="showAboutMeCard = true"
      aria-label="Open profile card"
    >
      About me
    </button>
    <button
      v-if="showMenuButtons"
      key="content"
      data-index="1"
      class="menu-btn"
      @click="showContentCard = true"
      aria-label="Open content card"
    >
      Content
    </button>
    <button
      v-if="showMenuButtons"
      key="experience"
      data-index="2"
      class="menu-btn"
      @click="showExperienceCard = true"
      aria-label="Open experience card"
    >
      Experience
    </button>
  </TransitionGroup>

  <!-- The live region stays mounted so the message is announced when it appears. -->
  <p class="loading-note" role="status">
    <Transition name="loading-note">
      <span v-if="showLoadingNote">
        The experience is still loading, but you can start here.
      </span>
    </Transition>
  </p>
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

.loading-note {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: max-content;
  max-width: calc(100vw - 2rem);
  text-align: center;
  font-size: 0.875rem;
  color: hsl(0 0% 97% / 0.75);
  pointer-events: none;
}

.loading-note-enter-active,
.loading-note-leave-active {
  transition: opacity 0.5s ease;
}

.loading-note-enter-from,
.loading-note-leave-to {
  opacity: 0;
}
</style>
