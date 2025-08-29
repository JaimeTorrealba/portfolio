<script setup>
import { onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Tooltip from "@/components/common/Tooltip.vue";
import TwitterIcon from "@/assets/icons/RRSS/TwitterIcon.vue";
import GithubIcon from "@/assets/icons/RRSS/GithubIcon.vue";
import LinkedinIcon from "@/assets/icons/RRSS/LinkedinIcon.vue";
import CodepenIcon from "@/assets/icons/RRSS/CodepenIcon.vue";
import BlueSkyIcon from "@/assets/icons/RRSS/BlueskyIcon.vue";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from(".icon-container", {
    scrollTrigger: ".icon-containers",
    duration: 1,
    y: 100,
    opacity: 0,
    stagger: 0.1,
  });
});

// const showTooltipBlueSky = ref(false);
// const showTooltipTwitter = ref(false);
// const showTooltipGithub = ref(false);
// const showTooltipLinkedin = ref(false);
// const showTooltipCodepen = ref(false);
// const showTooltipEmail = ref(false);
</script>
<template>
  <section class="icon-containers pt-6">
    <h4 class="title px-2 py-4 is-relative has-text-centered">Say hi!</h4>
    <div class="is-flex is-justify-content-space-between py-4">
      <a
        href="https://bsky.app/profile/jaimebboyjt.bsky.social"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltipBlueSky = true"
        @mouseleave="showTooltipBlueSky = false"
      >
        <div class="icon-container">
          <!-- <Tooltip text="Bluesky" :show="showTooltipBlueSky" anchor="top center"> -->
            <BlueSkyIcon />
          <!-- </Tooltip> -->
        </div>
      </a>
      <a
        href="https://twitter.com/jaimebboyjt"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltipTwitter = true"
        @mouseleave="showTooltipTwitter = false"
      >
        <div class="icon-container">
          <!-- <Tooltip text="Twitter" :show="showTooltipTwitter" anchor="top center"> -->
            <TwitterIcon />
          <!-- </Tooltip> -->
        </div>
      </a>

      <!-- <Tooltip text="Github" :show="showTooltipGithub" anchor="top center"> -->
      <a
        href="https://github.com/JaimeTorrealba"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltipGithub = true"
        @mouseleave="showTooltipGithub = false"
      >
        <div class="icon-container">
          <GithubIcon />
        </div>
      </a>
      <!-- </Tooltip> -->
      <!-- <Tooltip text="LinkedIn" :show="showTooltipLinkedin" anchor="top center"> -->
      <a
        href="https://www.linkedin.com/in/jaime-torrealba-cordova/"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltipLinkedin = true"
        @mouseleave="showTooltipLinkedin = false"
      >
        <div class="icon-container">
          <LinkedinIcon />
        </div>
      </a>
      <!-- </Tooltip> -->
      <!-- <Tooltip text="CodePen" :show="showTooltipCodepen" anchor="top center"> -->
      <a
        href="https://codepen.io/jaime_torrealba"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltipCodepen = true"
        @mouseleave="showTooltipCodepen = false"
      >
        <div class="icon-container">
          <CodepenIcon />
        </div>
      </a>
      <!-- </Tooltip> -->
      <!-- <Tooltip text="Email" :show="showTooltipEmail" anchor="top center"> -->
      <a
        href="mailto:solucionesinformaticasjtc@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltipEmail = true"
        @mouseleave="showTooltipEmail = false"
      >
        <div class="icon-container icon-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24px"
            stroke-width="2"
            stroke="#111"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>
      </a>
      <!-- </Tooltip> -->
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
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
