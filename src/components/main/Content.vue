<script setup>
import { onMounted, ref, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Dropdown from "@/components/common/Dropdown.vue";
import Card from "@/components/common/Card.vue";
import { items } from "@/utils/items.js";
gsap.registerPlugin(ScrollTrigger);

const types = items.map((item) => item.type);
const uniqueTypes = [...new Set(types)];

const selectedItem = ref(null);
const currentItems = ref(items);

watch(selectedItem, (newValue) => {
  if (newValue && newValue !== "All") {
    currentItems.value = items.filter((item) => item.type === newValue);
  } else {
    currentItems.value = items;
  }
  // animations cards when appears
  const cards = gsap.utils.toArray(".card");
  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 80%",
      animation: gsap.from(card, {
        duration: 0.5,
        y: 250, // no funciona
        opacity: 0,
      }),
    });
  });
});

const titleRef = ref(null);
onMounted(() => {
  gsap.from(titleRef.value, {
    scrollTrigger: titleRef.value,
    duration: 0.5,
    y: 250,
  });
  const cards = gsap.utils.toArray(".card-link");
  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 80%",
      animation: gsap.from(card, {
        duration: 0.5,
        y: 50,
        opacity: 0,
      }),
    });
  });
});
</script>
<template>
  <section>
    <div class="overflow-hidden-y">
      <h4 ref="titleRef" class="title">Content</h4>
    </div>
    <Dropdown v-model="selectedItem" :items="uniqueTypes" />
    <div class="container-item py">
      <div v-for="item in currentItems" :key="item.id">
        <Card :data="item" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.container-item {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
