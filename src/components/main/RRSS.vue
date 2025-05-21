<script setup>
import { onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
</script>
<template>
  <div class="flex flex-between icon-containers">
    <a
      href="https://bsky.app/profile/jaimebboyjt.bsky.social"
      target="_blank"
      rel="noopener noreferrer"
      v-tippy="'BlueSky'"
    >
      <div class="icon-container">
        <BlueSkyIcon />
      </div>
    </a>
    <a
      href="https://twitter.com/jaimebboyjt"
      target="_blank"
      rel="noopener noreferrer"
      v-tippy="'Twitter'"
    >
      <div class="icon-container">
        <TwitterIcon />
      </div>
    </a>
    <a
      href="https://github.com/JaimeTorrealba"
      target="_blank"
      rel="noopener noreferrer"
      v-tippy="'Github'"
    >
      <div class="icon-container">
        <GithubIcon />
      </div>
    </a>
    <a
      href="https://www.linkedin.com/in/jaime-torrealba-cordova/"
      target="_blank"
      rel="noopener noreferrer"
      v-tippy="'Linkedin'"
    >
      <div class="icon-container">
        <LinkedinIcon />
      </div>
    </a>
    <a
      href="https://codepen.io/jaime_torrealba"
      target="_blank"
      rel="noopener noreferrer"
      v-tippy="'Codepen'"
    >
      <div class="icon-container">
        <CodepenIcon />
      </div>
    </a>
    <a
      href="mailto:solucionesinformaticasjtc@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      v-tippy="'Email'"
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
  </div>
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
