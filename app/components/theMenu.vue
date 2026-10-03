<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useEventListener } from "@vueuse/core";
import { useMainStore } from "@/stores";
import {
  animateCardIn,
  animateCardOut,
  animateMenuButtonIn,
  animateMenuButtonOut,
} from "@/utils/menuTransitions.js";
import { keepFocusInside } from "@/utils/focusTrap.js";
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

const cardVisibility = {
  about: showAboutMeCard,
  content: showContentCard,
  experience: showExperienceCard,
};
const aboutBtnRef = ref(null);
const contentBtnRef = ref(null);
const experienceBtnRef = ref(null);
const menuButtonRefs = {
  about: aboutBtnRef,
  content: contentBtnRef,
  experience: experienceBtnRef,
};

// The open card's root element, and which menu entry opened it: focus moves into the
// card on open, stays inside it, and goes back to that button once the menu returns.
let openCardEl = null;
let lastOpenedCard = null;

const openCard = (cardKey) => {
  lastOpenedCard = cardKey;
  cardVisibility[cardKey].value = true;
};

const closeAllCards = () => {
  Object.values(cardVisibility).forEach((isVisible) => {
    isVisible.value = false;
  });
};

watch(showMenuButtons, async (visible) => {
  if (!visible || !lastOpenedCard) return;
  await nextTick();
  menuButtonRefs[lastOpenedCard].value?.focus();
  lastOpenedCard = null;
});

useEventListener(document, "keydown", (event) => {
  if (event.key === "Escape") closeAllCards();
  else if (event.key === "Tab" && openCardEl) keepFocusInside(openCardEl, event);
});

const onEnter = (el, done) => {
  openCardEl = el;
  el.querySelector(".close-btn")?.focus({ preventScroll: true });
  animateCardIn(el, done);
};

const onLeave = (el, done) => {
  if (openCardEl === el) openCardEl = null;
  animateCardOut(el, done);
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
    @enter="animateMenuButtonIn"
    @leave="animateMenuButtonOut"
    tag="div"
    class="btn-group"
  >
    <button
      v-if="showMenuButtons"
      key="about"
      data-index="0"
      ref="aboutBtnRef"
      class="menu-btn"
      @click="openCard('about')"
    >
      About me
    </button>
    <button
      v-if="showMenuButtons"
      key="content"
      data-index="1"
      ref="contentBtnRef"
      class="menu-btn"
      @click="openCard('content')"
    >
      Content
    </button>
    <button
      v-if="showMenuButtons"
      key="experience"
      data-index="2"
      ref="experienceBtnRef"
      class="menu-btn"
      @click="openCard('experience')"
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
  /* The labels sit straight on the scene, which brightens under the moon and the
     spotlight; a soft dark halo keeps them readable wherever they land. */
  text-shadow: 0 0 0.75rem rgb(0 0 0 / 0.85), 0 1px 2px rgb(0 0 0 / 0.9);
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
