<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import TwitterIcon from '@/assets/icons/TwitterIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import LinkedinIcon from '@/assets/icons/LinkedinIcon.vue'
import CodepenIcon from '@/assets/icons/CodepenIcon.vue'
import BlueSkyIcon from '@/assets/icons/BlueskyIcon.vue'

onMounted(() => {
  gsap.from('.icon-container', {
    duration: 1,
    y: 100,
    delay: 0.5,
    opacity: 0,
    stagger: 0.1
  })
})
</script>
<template>
  <div class="flex flex-between max-width">
    <a href="https://bsky.app/profile/jaimebboyjt.bsky.social" target="_blank" rel="noopener noreferrer"
      v-tippy="'BlueSky'">
      <div class="icon-container">
        <BlueSkyIcon />
      </div>
    </a>
    <a href="https://twitter.com/jaimebboyjt" target="_blank" rel="noopener noreferrer" v-tippy="'Twitter'">
      <div class="icon-container">
        <TwitterIcon />
      </div>
    </a>
    <a href="https://github.com/JaimeTorrealba" target="_blank" rel="noopener noreferrer" v-tippy="'Github'">
      <div class="icon-container">
        <GithubIcon />
      </div>
    </a>
    <a href="https://www.linkedin.com/in/jaime-torrealba-cordova/" target="_blank" rel="noopener noreferrer"
      v-tippy="'Linkedin'">
      <div class="icon-container">
        <LinkedinIcon />
      </div>
    </a>
    <a href="https://codepen.io/jaime_torrealba" target="_blank" rel="noopener noreferrer" v-tippy="'Codepen'">
      <div class="icon-container">
        <CodepenIcon />
      </div>
    </a>
  </div>
</template>
<style scoped>
.max-width {
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.icon-container {
  border-radius: 4px;
  background-color: #e4e4e4;
  box-shadow: inset 0 0 4px 1.5px rgba(1, 1, 1, 0.5);
  padding: 0.25rem;
  margin: 0 0.25rem;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  overflow: hidden;
}
</style>