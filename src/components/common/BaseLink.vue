<script setup>
defineProps({
    text: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    }
})
</script>
<template>
    <a :href="href" class="link-animation" target="_blank" rel="no-referrer">{{ text }}</a>
</template>
<style scoped>
.link-animation {
    text-decoration: none;
    color: white;
    position: relative;
  }
  .link-animation::before {
    content: "";
    background: linear-gradient(to right, rgb(255,255,255) 45%, rgba(255,255,255,0.3) 55%);
    background-size: 220% 100%;
    background-position: 100% 50%;
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-repeat: no-repeat;
    transition: .3s ease-out;
  }
  .link-animation:hover::before {
    background: linear-gradient(to right, rgb(255,255,255) 45%, rgba(255,255,255,0.3) 55%);
    background-size: 220% 100%;
    background-position: 0% 50%;
    transition: .3s ease-out;
  }
</style>