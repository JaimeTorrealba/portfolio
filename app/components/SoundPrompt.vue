<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores";
import { animateMenuButtonIn, animateMenuButtonOut } from "@/utils/menuTransitions.js";
import MenuButton from "@/components/common/MenuButton.vue";

// The first thing a visitor sees, on top of the loading screen: whether to come in with
// sound. Skipped when the session already has an answer (see the store).
const SOUND_CHOICES = [
  { preference: "on", label: "Full experience" },
  { preference: "off", label: "Better mute, please" },
];

const store = useMainStore();
const visibleChoices = computed(() => (store.soundChosen ? [] : SOUND_CHOICES));
</script>

<template>
  <TransitionGroup
    appear
    :css="false"
    @enter="animateMenuButtonIn"
    @leave="animateMenuButtonOut"
    tag="div"
    class="sound-prompt"
    role="group"
    aria-label="How do you want to enter?"
  >
    <MenuButton
      v-for="(choice, index) in visibleChoices"
      :key="choice.preference"
      :data-index="index"
      @click="store.setSoundPreference(choice.preference)"
    >
      {{ choice.label }}
    </MenuButton>
  </TransitionGroup>
</template>

<style scoped>
.sound-prompt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
</style>
