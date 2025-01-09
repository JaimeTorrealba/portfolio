<script setup>
import { useCustomRouterFn } from "@/composables/routers.js";
import CloseIcon from '@/assets/icons/CloseIcon.vue'
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize()
const { goToMain } = useCustomRouterFn()
</script>
<template>
    <button class="button-back pointer" @click="goToMain()" v-if="width < 768">
        <CloseIcon />
      </button>
</template>
<style scoped>
.button-back {
    position: absolute;
    top: 2%;
    right: 2.5%;
    border-radius: 50%;
  }
</style>