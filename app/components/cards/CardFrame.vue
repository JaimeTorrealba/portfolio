<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { createCardFrame } from "@/utils/cardFrame/card-frame.js";

// Vue wrapper around the framework-agnostic card frame. The content element is rendered
// here, so the module only prepends its art and never moves Vue-managed nodes.
const props = defineProps({
  seed: { type: Number, default: 1337 },
  // Any createCardFrame option (thickness, thornCount, footer...).
  options: { type: Object, default: () => ({}) },
});

const frameRef = ref(null);

let frame = null;
onMounted(() => {
  // Baked: the cards open and close with a GSAP scale, and a bitmap scales for free
  // where live lighting filters might be re-run.
  frame = createCardFrame(frameRef.value, { bake: true, ...props.options, seed: props.seed });
});
watch(
  () => props.seed,
  (seed) => frame?.setSeed(seed),
);
// keepDom: the card is still animating out when this runs; Vue removes it afterwards.
onBeforeUnmount(() => frame?.destroy({ keepDom: true }));
</script>

<template>
  <div ref="frameRef">
    <div class="card-frame__content">
      <slot />
    </div>
  </div>
</template>

<style src="../../utils/cardFrame/card-frame.css"></style>
