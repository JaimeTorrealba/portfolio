<script setup>
import { ref, computed, watch, nextTick } from "vue";
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
import MenuButton from "@/components/common/MenuButton.vue";

const store = useMainStore();
const showAboutMeCard = ref(false);
const showContentCard = ref(false);
const showExperienceCard = ref(false);

const showMenuButtons = computed(
  () =>
    store.loaderAlmostGone &&
    !showAboutMeCard.value &&
    !showContentCard.value &&
    !showExperienceCard.value
);

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
  // The close button is the red button the card frame mounts in its footer.
  el.querySelector(".card-frame__footer .cf-btn")?.focus({ preventScroll: true });
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
    class="btn-group menu-btn-group"
  >
    <MenuButton
      v-if="showMenuButtons"
      key="about"
      data-index="0"
      ref="aboutBtnRef"
      @click="openCard('about')"
    >
      About me
    </MenuButton>
    <MenuButton
      v-if="showMenuButtons"
      key="content"
      data-index="1"
      ref="contentBtnRef"
      @click="openCard('content')"
    >
      Content
    </MenuButton>
    <MenuButton
      v-if="showMenuButtons"
      key="experience"
      data-index="2"
      ref="experienceBtnRef"
      @click="openCard('experience')"
    >
      Experience
    </MenuButton>
    <MenuButton
      v-if="showMenuButtons"
      key="projects"
      data-index="3"
      work-in-progress
    >
      Projects
    </MenuButton>
  </TransitionGroup>
</template>

<style scoped>
.btn-group {
  position: fixed;
  /* 5rem to the last label; the buttons' own padding-block covers the rest. */
  bottom: 4.375rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
}
</style>
