<script setup>
import { ref } from "vue";

// The text button used by the menu and the sound choice screen, so one style and one
// hover state cover both. Their containers carry the menu-btn-group class (see below).
defineProps({
  // A menu entry that exists but has nothing to open yet: struck through, with a
  // "Work in progress" tooltip on hover or focus.
  workInProgress: { type: Boolean, default: false },
});

const buttonRef = ref(null);

// theMenu.vue sends focus back to the button that opened a card.
defineExpose({ focus: () => buttonRef.value?.focus() });
</script>

<template>
  <!-- aria-disabled rather than disabled: the button stays focusable, so keyboard
       users can reach it and read the tooltip. -->
  <button
    ref="buttonRef"
    class="menu-btn"
    :class="{ 'menu-btn--wip': workInProgress }"
    :aria-disabled="workInProgress || undefined"
  >
    <span class="menu-btn__label"><slot /></span>
    <span v-if="workInProgress" class="menu-btn__tooltip" role="tooltip">
      Work in progress
    </span>
  </button>
</template>

<style scoped>
.menu-btn {
  position: relative;
  color: var(--white);
  font-family: "sentient";
  font-size: calc(1.125rem * 1.5);
  border-radius: 0.75rem;
  background-color: transparent;
  /* The space between buttons lives here, not in the container's gap, so neighbouring
     hit areas touch: moving the pointer from one to the next never crosses a spot
     where nothing is hovered (which would flash every label back to full size). */
  padding-block: 0.625rem;
  /* The labels sit straight on the scene, which brightens under the moon and the
     spotlight; a soft dark halo keeps them readable wherever they land. */
  text-shadow: 0 0 0.75rem rgb(0 0 0 / 0.85), 0 1px 2px rgb(0 0 0 / 0.9);
}

/* The hover scale goes on the label, not the button: GSAP animates the button's
   enter/leave (menuTransitions.js) and writes an inline `scale: none` on it, which would
   override any stylesheet scale. Scaling the label also leaves the hit area unchanged. */
.menu-btn__label {
  display: inline-block;
  transition: scale 0.15s ease-out;
}

.menu-btn:hover .menu-btn__label,
.menu-btn:focus-visible .menu-btn__label {
  scale: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .menu-btn__label {
    transition: none;
  }
}

.menu-btn--wip {
  cursor: default;
}

.menu-btn--wip .menu-btn__label {
  text-decoration: line-through;
  text-decoration-thickness: 1px;
  opacity: 0.6;
}

.menu-btn__tooltip {
  position: absolute;
  /* Below the padding, clear of the label at its 1.5 hover scale. */
  top: calc(100% + 0.375rem);
  left: 50%;
  translate: -50% 0.25rem;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  white-space: nowrap;
  text-shadow: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease-out, translate 0.15s ease-out;
}

.menu-btn--wip:hover .menu-btn__tooltip,
.menu-btn--wip:focus-visible .menu-btn__tooltip {
  opacity: 1;
  translate: -50% 0;
}
</style>

<style>
/* Not scoped: the rule reads the container, which belongs to the parent component.
   While one button is hovered or focused, the others shrink so it stands out. */
.menu-btn-group:has(> .menu-btn:hover, > .menu-btn:focus-visible)
  > .menu-btn:not(:hover, :focus-visible)
  .menu-btn__label {
  scale: 0.9;
}
</style>
