<script setup>
import CardBase from "./CardBase.vue";
</script>
<template>
    <CardBase>
    <template #media-left>
      <figure class="image is-96x96">
        <img
        class="has-background-white py-5 px-1"
          src="/img/LemuLogo.png"
          alt="Placeholder image"
        />
      </figure>
    </template>
    <template #media-content>
      <p class="title is-4 pb-1">Lemu </p>
      <p class="subtitle has-text-light is-5">
        Front-end developer <br />
        <span class="is-size-6 has-text-grey-light is-italic"
          >Lemu is a startup focused on conservation parks and wildlife.</span
        >
      </p>
    </template>
    <template #content>
      <p class="is-size-5 has-text-light">
         I focused on building the mobile app using Flutter, Firebase as backend and Google map APIs.
      </p>
      <time datetime="2022-9-1">03/2022 - 09/2022  </time>
    </template>
  </CardBase>

</template>