<script setup>
import { onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TwitterIcon from "@/assets/icons/TwitterIcon.vue";
import GithubIcon from "@/assets/icons/GithubIcon.vue";
import LinkedinIcon from "@/assets/icons/LinkedinIcon.vue";
import CodepenIcon from "@/assets/icons/CodepenIcon.vue";
import BlueSkyIcon from "@/assets/icons/BlueskyIcon.vue";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from(".icon-container", {
    scrollTrigger: ".icon-container",
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
  </div>
</template>
<style scoped>
.icon-containers {
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
}
</style>
