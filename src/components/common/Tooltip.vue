<template>
  <div class="relative inline-block">
    <!-- Trigger slot -->
    <div class="trigger">
      <slot />
    </div>

    <!-- Tooltip -->
    <transition>
      <div
        v-if="show"
        class="tooltip-styles notification"
      >
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  show: { type: Boolean, default: false },
  anchor: { type: String, default: "top" },
});
</script>
<style scoped>
.trigger {
  anchor-name: v-bind(text);
}
.tooltip-styles {
  position: absolute;
  text-align: center;
  padding: 8px 12px;
  margin: 0.5rem 0;
  z-index: 9999;
  text-wrap: v-bind("clickOutside ? 'wrap' : 'nowrap'");
  position-anchor: v-bind(text);
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
