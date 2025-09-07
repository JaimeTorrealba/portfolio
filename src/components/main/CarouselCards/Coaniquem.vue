<script setup>
import CardBase from "./CardBase.vue";
</script>
<template>
  <CardBase>
    <template #media-left>
      <figure class="image is-96x96">
        <img
          class="has-background-white py-4 px-1"
          src="/img/CoaniquemLogo.svg"
          alt="Placeholder image"
        />
      </figure>
    </template>
    <template #media-content>
      <p class="title is-4 pb-1">Coaniquem</p>
      <p class="subtitle has-text-light is-5">
        Front-end developer <br />
        <span class="is-size-6 has-text-grey-light is-italic"
          >Coaniquem is a NGO that helps children recovering from severe burns for free in
          Chile</span
        >
      </p>
    </template>
    <template #content>
      <p class="is-size-5 has-text-light">
        Our team created several platforms to sign up volunteers, take donations, and
        coordinate partners. I was responsible for the front- end (VueJs).
      </p>
      <time datetime="2019-7-1">02/2017 - 07/2019 </time>
    </template>
  </CardBase>
</template>
