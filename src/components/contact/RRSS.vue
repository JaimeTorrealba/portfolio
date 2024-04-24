<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import TwitterIcon from '@/assets/icons/TwitterIcon.vue'
import GithubIcon from '@/assets/icons/GithubIcon.vue'
import LinkedinIcon from '@/assets/icons/LinkedinIcon.vue'

onMounted(() => {
   gsap.from('.icon-container', {
      duration: 1,
      y: 100,
      delay: 0.5,
      opacity: 0,
      stagger: 0.2
   })
})
</script>
<template>
    <div class="flex flex-between">
        <a href="https://twitter.com/jaimebboyjt" target="_blank" rel="noopener noreferrer">
          <div class="icon-container">
            <TwitterIcon />
          </div>
        </a>
        <a href="https://github.com/JaimeTorrealba" target="_blank" rel="noopener noreferrer">
          <div class="icon-container">
            <GithubIcon />
          </div>
        </a>
        <a href="https://www.linkedin.com/in/jaime-torrealba-cordova/" target="_blank" rel="noopener noreferrer">
          <div class="icon-container">
            <LinkedinIcon />
          </div>
        </a>
      </div>
</template>