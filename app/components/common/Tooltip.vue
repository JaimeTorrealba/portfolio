<template>
  <div>
    <!-- Trigger slot -->
    <div class="trigger">
      <slot />
    </div>

    <!-- Tooltip. Hidden from screen readers: the trigger's own label already says it. -->
    <transition>
      <div
        v-if="show"
        class="tooltip-styles"
        aria-hidden="true"
      >
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  text: { type: String, required: true },
  show: { type: Boolean, default: false },
  anchor: { type: String, default: "top" },
});

// anchor-name only accepts a dashed ident (`--name`); the bare text ("Bluesky") was
// invalid, so the browser dropped it and position-area never applied.
const anchorName = computed(() => `--tooltip-${props.text.replace(/[^a-zA-Z0-9-]/g, "-")}`);
</script>
<style scoped>
.trigger {
  anchor-name: v-bind(anchorName);
  transition: scale 0.15s ease;
}
.trigger:hover {
  scale: 1.1;
}
.tooltip-styles {
  position: absolute;
  text-align: center;
  padding: 8px 12px;
  margin: 0.5rem 0;
  z-index: 9999;
  text-wrap: nowrap;
  position-anchor: v-bind(anchorName);
  position-area: v-bind(anchor);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
