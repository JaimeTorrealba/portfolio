<script setup>
import CardBase from "./CardBase.vue";
</script>
<template>
    <CardBase>
    <template #media-left>
      <figure class="image is-96x96">
        <img
          src="/img/TresLogo.svg"
          alt="Placeholder image"
        />
      </figure>
    </template>
    <template #media-content>
      <p class="title is-4 pb-1">Tres.js </p>
      <p class="subtitle has-text-light is-5">
        OSS maintainer <br />
        <span class="is-size-6 has-text-grey-light is-italic"
          >Tresjs is a library for building 3D experiences using VueJs and ThreeJs</span
        >
      </p>
    </template>
    <template #content>
      <p class="is-size-5 has-text-light">
         I was responsible for the Cientos package, one of the principal packages of the ecosystem, which creates abstractions to make life for our users easier. In addition to coding, I also review all PRs, encourage and support other developers, and make contributions to other packages, inside and outside TresJs.
      </p>
      <time datetime="2024-10-1">11/2022 - 10/2024</time>
    </template>
  </CardBase>

</template>