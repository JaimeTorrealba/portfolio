<script setup>
import { onMounted, ref, watch } from "vue";
import rough from 'roughjs';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Dropdown from "@/components/common/Dropdown.vue";
import Card from "@/components/common/Card.vue";
import { items } from "@/utils/items.js";
gsap.registerPlugin(ScrollTrigger, SplitText);

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
   const title = SplitText.create(titleRef.value, {
    type: "chars",
  });
  gsap.from(title.chars, {
    duration: 0.75,
    opacity: 0,
    stagger: 0.1,
    ease: "power2.out",
  });

  const rc = rough.canvas(document.getElementById('contentCanvas'));
  rc.line(20, 130, 290, 130, { stroke: "white" });
  rc.line(20, 70, 290, 70, { stroke: "white" });
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
    <div class="overflow-hidden-y title-padding relative">
      <h4 ref="titleRef" class="title ">Content</h4>
      <canvas id="contentCanvas" class="canvas" width="300" height="200"></canvas>
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

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  @media screen and (max-width: 500px) {
    display: none;
  }
}

.title-padding {
  padding: 0 2rem;
  @media screen and (max-width: 500px) {
    padding: 0;
  }
}
</style>
