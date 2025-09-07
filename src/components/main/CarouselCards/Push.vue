<script setup>
import CardBase from "./CardBase.vue";
</script>
<template>
    <CardBase>
    <template #media-left>
      <figure class="image is-96x96">
        <img
          class="has-background-white py-4 px-1"
          src="/img/PushLogo.svg"
          alt="Placeholder image"
        />
      </figure>
    </template>
    <template #media-content>
      <p class="title is-4 pb-1">Push security </p>
      <p class="subtitle has-text-light is-5">
        Front-end developer <br />
        <span class="is-size-6 has-text-grey-light is-italic"
          >Push security is a browser-based detection and response company.</span
        >
      </p>
    </template>
    <template #content>
      <p class="is-size-5 has-text-light">
         I work in the site close with the marketing and design team, I'was hired as the "animation muscle" to bring life to the web platform using Nuxt.js, GSAP and Three.js.
      </p>
      <time datetime="2022-11-1">11/2024 - Present</time>
    </template>
  </CardBase>

</template>