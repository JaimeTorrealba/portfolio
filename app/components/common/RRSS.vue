<script setup>
import { ref, watchEffect, nextTick, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { useMainStore } from "@/stores";
import { prefersReducedMotion } from "@/utils/motion.js";
import { playHoverSoundOnMouseEnter } from "@/utils/uiSounds.js";
import Tooltip from "@/components/common/Tooltip.vue";
import Twitter from "@/assets/icons/RRSS/Twitter.vue";
import Github from "@/assets/icons/RRSS/Github.vue";
import Linkedin from "@/assets/icons/RRSS/Linkedin.vue";
import Codepen from "@/assets/icons/RRSS/Codepen.vue";
import BlueSky from "@/assets/icons/RRSS/Bluesky.vue";
import Lab from "@/assets/icons/RRSS/Lab.vue";
import { person, socials } from "#shared/profile";

const store = useMainStore();
const rrssRef = ref(null);

// Scoped to this component (the selector used to match the whole document) and killed
// when the card closes, so a half-played intro does not outlive it.
let iconsContext = null;
const playAnimation = async () => {
  await nextTick();
  if (prefersReducedMotion() || !rrssRef.value) return;
  iconsContext?.kill();
  iconsContext = gsap.context(() => {
    gsap.from(".icon-container", {
      duration: 1,
      delay: 0.75,
      y: 15,
      opacity: 0,
      stagger: 0.15,
      ease: "elastic.out",
    });
  }, rrssRef.value);
};
onBeforeUnmount(() => iconsContext?.kill());

watchEffect(() => {
  if (store.sceneRevealed) {
    playAnimation();
  }
});

const showTooltipBlueSky = ref(false);
const showTooltipTwitter = ref(false);
const showTooltipGithub = ref(false);
const showTooltipLinkedin = ref(false);
const showTooltipCodepen = ref(false);
const showTooltipLab = ref(false);
</script>
<template>
  <section ref="rrssRef" class="icon-containers">
    <div class="rrss-container">
      <Tooltip text="Bluesky" :show="showTooltipBlueSky" anchor="bottom center">
        <a
          :href="socials.bluesky.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.bluesky.label}`"
          @pointerenter="playHoverSoundOnMouseEnter"
          @mouseenter="showTooltipBlueSky = true"
          @mouseleave="showTooltipBlueSky = false"
          @focus="showTooltipBlueSky = true"
          @blur="showTooltipBlueSky = false"
        >
          <div class="icon-container">
            <BlueSky />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="Twitter" :show="showTooltipTwitter" anchor="bottom center">
        <a
          :href="socials.twitter.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.twitter.label}`"
          @pointerenter="playHoverSoundOnMouseEnter"
          @mouseenter="showTooltipTwitter = true"
          @mouseleave="showTooltipTwitter = false"
          @focus="showTooltipTwitter = true"
          @blur="showTooltipTwitter = false"
        >
          <div class="icon-container">
            <Twitter />
          </div>
        </a>
      </Tooltip>

      <Tooltip text="Github" :show="showTooltipGithub" anchor="bottom center">
        <a
          :href="socials.github.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.github.label}`"
          @pointerenter="playHoverSoundOnMouseEnter"
          @mouseenter="showTooltipGithub = true"
          @mouseleave="showTooltipGithub = false"
          @focus="showTooltipGithub = true"
          @blur="showTooltipGithub = false"
        >
          <div class="icon-container">
            <Github />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="LinkedIn" :show="showTooltipLinkedin" anchor="bottom center">
        <a
          :href="socials.linkedin.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.linkedin.label}`"
          @pointerenter="playHoverSoundOnMouseEnter"
          @mouseenter="showTooltipLinkedin = true"
          @mouseleave="showTooltipLinkedin = false"
          @focus="showTooltipLinkedin = true"
          @blur="showTooltipLinkedin = false"
        >
          <div class="icon-container">
            <Linkedin />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="CodePen" :show="showTooltipCodepen" anchor="bottom center">
        <a
          :href="socials.codepen.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.codepen.label}`"
          @pointerenter="playHoverSoundOnMouseEnter"
          @mouseenter="showTooltipCodepen = true"
          @mouseleave="showTooltipCodepen = false"
          @focus="showTooltipCodepen = true"
          @blur="showTooltipCodepen = false"
        >
          <div class="icon-container">
            <Codepen />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="Lab" :show="showTooltipLab" anchor="bottom center">
        <a
          :href="socials.lab.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.lab.label}`"
          @pointerenter="playHoverSoundOnMouseEnter"
          @mouseenter="showTooltipLab = true"
          @mouseleave="showTooltipLab = false"
          @focus="showTooltipLab = true"
          @blur="showTooltipLab = false"
        >
          <div class="icon-container icon-centered">
            <Lab />
          </div>
        </a>
      </Tooltip>
    </div>
  </section>
</template>
<style scoped>
.icon-containers {
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
}
.icon-centered {
  display: grid;
  place-items: center;
}

.rrss-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0.5rem;
}
</style>
