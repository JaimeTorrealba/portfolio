<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Dropdown from "@/components/common/Dropdown.vue";
import { items } from "@/utils/items.js";
gsap.registerPlugin(ScrollTrigger);

const types = items.map((item) => item.type);
const uniqueTypes = [...new Set(types)];

const selectedItem = ref(null);

const titleRef = ref(null);
onMounted(() => {
  gsap.from(titleRef.value, {
    scrollTrigger: titleRef.value,
    duration: 0.5,
    y: 250,
  });
});
</script>
<template>
  <section>
    <div class="overflow-hidden-y">
      <h4 ref="titleRef" class="title">Content</h4>
    </div>
    <Dropdown v-model="selectedItem" :items="uniqueTypes" />
  </section>
</template>
