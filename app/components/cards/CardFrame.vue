<script setup>
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { createRedButton } from "@/utils/redButton/red-button.js";
import { playHoverSoundOnMouseEnter } from "@/utils/uiSounds.js";
import { cardEdgeOptions as edge } from "@/utils/cardEdge.js";

// The card's panel: a black slab with a torn, grainy edge (one SVG filter, tuned in the
// debug pane's "Card Edge" folder), and the red Close button in its footer.
const props = defineProps({
  seed: { type: Number, default: 1337 },
});

const emit = defineEmits(["close"]);

const edgeFilterId = `card-edge-${useId()}`;
const closeButtonRef = ref(null);

// Each card's button differs from its panel's noise.
const getButtonSeed = (seed) => seed + 101;

let closeButton = null;
onMounted(() => {
  // Baked: the cards open and close with a GSAP scale, and a bitmap scales for free
  // where live lighting filters might be re-run.
  closeButton = createRedButton(closeButtonRef.value, { seed: getButtonSeed(props.seed), bake: true });
});
watch(
  () => props.seed,
  (seed) => closeButton?.setSeed(getButtonSeed(seed)),
);
// keepDom: the card is still animating out when this runs; Vue removes it afterwards.
onBeforeUnmount(() => closeButton?.destroy({ keepDom: true }));
</script>

<template>
  <div class="card-frame">
    <!-- Torn edge: low-frequency noise pushes the outline in and out, then fine grain eats
         into the blurred rim so the edge breaks up into specks instead of a clean line. -->
    <svg class="card-frame__edge" aria-hidden="true" focusable="false">
      <filter
        :id="edgeFilterId"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence type="fractalNoise" :baseFrequency="edge.tearSize" numOctaves="3" :seed="seed" result="warp" />
        <feDisplacementMap
          in="SourceAlpha"
          in2="warp"
          :scale="edge.tear"
          xChannelSelector="R"
          yChannelSelector="G"
          result="torn"
        />
        <feGaussianBlur in="torn" :stdDeviation="edge.fringe" result="fade" />
        <feTurbulence type="fractalNoise" :baseFrequency="edge.grainSize" numOctaves="2" :seed="seed + 1" result="grain" />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"
          result="grainAlpha"
        />
        <!-- alpha = hardness * fade + grain * (noise - 1): solid inside, specks where fade drops. -->
        <feComposite
          in="fade"
          in2="grainAlpha"
          operator="arithmetic"
          :k2="edge.hardness"
          :k3="edge.grain"
          :k4="-edge.grain"
          result="speckled"
        />
        <feFlood :flood-color="edge.colour" :flood-opacity="edge.opacity" result="panel" />
        <feComposite in="panel" in2="speckled" operator="in" />
      </filter>
      <rect width="100%" height="100%" :filter="`url(#${edgeFilterId})`" />
    </svg>
    <div class="card-frame__content">
      <slot />
    </div>
    <div class="card-frame__footer">
      <button
        ref="closeButtonRef"
        type="button"
        aria-label="Close card"
        @pointerenter="playHoverSoundOnMouseEnter"
        @click="emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-frame {
  position: relative;
  isolation: isolate;
}

/* Fills the card; overflow: visible lets the torn edge spill a few px past it. */
.card-frame__edge {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 0;
  pointer-events: none;
}

.card-frame__content,
.card-frame__footer {
  position: relative;
  z-index: 1;
}

.card-frame__content {
  padding: 1.25rem;
}

.card-frame__footer {
  display: flex;
  justify-content: center;
  padding-bottom: 1.5rem;
}
</style>

<style src="../../utils/redButton/red-button.css"></style>
