<script setup>
import CardBase from "./CardBase.vue";
</script>
<template>
    <CardBase>
    <template #media-left>
      <figure class="image is-64x64">
        <img
          class="has-background-gray px-1"
          src="/img/RipleyLogo.svg"
          alt="Placeholder image"
        />
      </figure>
    </template>
    <template #media-content>
      <p class="title is-4 pb-1">Ripley Tech</p>
      <p class="subtitle has-text-light is-5">
        Full-stack Developer <br />
        <span class="is-size-6 has-text-grey-light is-italic"
          >One of the biggest retail companies in Chile.</span
        >
      </p>
    </template>
    <template #content>
      <p class="is-size-5 has-text-light">
       I was in the post-sales tech team, where I was responsible for creating and maintaining the post-sales process dedicated platform for our sellers. I did both front-end (ReactJs) and back-end (NodeJs). development.
      </p>
      <time datetime="2022-3-1">07/2019 - 03/2022  </time>
    </template>
  </CardBase>

</template>