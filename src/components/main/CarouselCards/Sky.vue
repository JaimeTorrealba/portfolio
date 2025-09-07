<script setup>
import CardBase from "./CardBase.vue";
</script>
<template>
  <CardBase>
    <template #media-left>
      <figure class="image is-96x96">
        <img
          class="has-background-white py-4 px-1"
          src="/img/SkyLogo.svg"
          alt="Placeholder image"
        />
      </figure>
    </template>
    <template #media-content>
      <p class="title is-4 pb-1">SKY airlines</p>
      <p class="subtitle has-text-light is-5">
        Front-end developer <br />
        <span class="is-size-6 has-text-grey-light is-italic"
          >SKY is one of the main low-cost airlines operating in Chile and Peru.
        </span>
      </p>
    </template>
    <template #content>
      <p class="is-size-5 has-text-light">
        I worked for the sales development team, which owns the whole process from when a
        customer enters the site until they pay. My daily work involved using micro-fronts
        with VueJs and our internal Design System.
      </p>
      <time datetime="2024-4-1">09/2022 - 17/04/2024</time>
    </template>
  </CardBase>
</template>
