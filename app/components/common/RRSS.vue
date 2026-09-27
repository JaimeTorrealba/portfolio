<script setup>
import { ref, watchEffect, nextTick } from "vue";
import gsap from "gsap";
import { useMainStore } from "@/stores";
import { prefersReducedMotion } from "@/utils/motion.js";
import Tooltip from "@/components/common/Tooltip.vue";
import Twitter from "@/assets/icons/RRSS/Twitter.vue";
import Github from "@/assets/icons/RRSS/Github.vue";
import Linkedin from "@/assets/icons/RRSS/Linkedin.vue";
import Codepen from "@/assets/icons/RRSS/Codepen.vue";
import BlueSky from "@/assets/icons/RRSS/Bluesky.vue";
import Lab from "@/assets/icons/RRSS/Lab.vue";
import { person, socials } from "#shared/profile";

const store = useMainStore();

const playAnimation = async () => {
  await nextTick();
  if (prefersReducedMotion()) return;
  gsap.from(".icon-container", {
    duration: 1,
    delay: 0.75,
    y: 15,
    opacity: 0,
    stagger: 0.15,
    ease: "elastic.out",
  });
};

watchEffect(() => {
  if (store.finishLoading) {
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
  <section class="icon-containers radial-gradient pt-6">
    <div class="rrss-container">
      <Tooltip text="Bluesky" :show="showTooltipBlueSky" anchor="top center">
        <a
          :href="socials.bluesky.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.bluesky.label}`"
          @mouseenter="showTooltipBlueSky = true"
          @mouseleave="showTooltipBlueSky = false"
        >
          <div class="icon-container">
            <BlueSky />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="Twitter" :show="showTooltipTwitter" anchor="top center">
        <a
          :href="socials.twitter.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.twitter.label}`"
          @mouseenter="showTooltipTwitter = true"
          @mouseleave="showTooltipTwitter = false"
        >
          <div class="icon-container">
            <Twitter />
          </div>
        </a>
      </Tooltip>

      <Tooltip text="Github" :show="showTooltipGithub" anchor="top center">
        <a
          :href="socials.github.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.github.label}`"
          @mouseenter="showTooltipGithub = true"
          @mouseleave="showTooltipGithub = false"
        >
          <div class="icon-container">
            <Github />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="LinkedIn" :show="showTooltipLinkedin" anchor="top center">
        <a
          :href="socials.linkedin.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.linkedin.label}`"
          @mouseenter="showTooltipLinkedin = true"
          @mouseleave="showTooltipLinkedin = false"
        >
          <div class="icon-container">
            <Linkedin />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="CodePen" :show="showTooltipCodepen" anchor="top center">
        <a
          :href="socials.codepen.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.codepen.label}`"
          @mouseenter="showTooltipCodepen = true"
          @mouseleave="showTooltipCodepen = false"
        >
          <div class="icon-container">
            <Codepen />
          </div>
        </a>
      </Tooltip>
      <Tooltip text="Lab" :show="showTooltipLab" anchor="top center">
        <a
          :href="socials.lab.url"
          target="_blank"
          rel="me noopener noreferrer"
          :aria-label="`${person.name} on ${socials.lab.label}`"
          @mouseenter="showTooltipLab = true"
          @mouseleave="showTooltipLab = false"
        >
          <div class="icon-container icon-border">
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
.icon-border {
  background-color: #f7f7f7;
  border-radius: 50%;
  padding: 0.2rem;
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
