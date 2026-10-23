<script setup>
import { ref } from "vue";

// The text button used by the menu and the sound choice screen, so one style (and the
// hover state, later) covers both.
const buttonRef = ref(null);

// theMenu.vue sends focus back to the button that opened a card.
defineExpose({ focus: () => buttonRef.value?.focus() });
</script>

<template>
  <button ref="buttonRef" class="menu-btn">
    <slot />
  </button>
</template>

<style scoped>
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
</style>
