<script setup>
import { onMounted, ref, watch } from "vue";
import rough from "roughjs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
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
    scrollTrigger: {
      trigger: titleRef.value,
      start: "top 80%",
      // markers: true, // TODO: debug this
    },
  });

  const rc = rough.canvas(document.getElementById("contentCanvas"));
  rc.rectangle(16, 1, 140, 50, { stroke: "white" });
});
</script>
<template>
  <section class="is-relative">
    <h4
      ref="titleRef"
      class="title mx-4 p-2 is-relative title-position has-background-black-bis"
    >
      Content
    </h4>
    <canvas id="contentCanvas" class="canvas" width="300" height="200"></canvas>
    <div class="is-relative">
      <div class="diffuse">
        <div
          class="is-flex is-flex-direction-column is-relative container-item scroll px-4 pb-4"
        >
          <div class="sticky has-background-black-bis pt-4 pb-2">
            <ul class="is-flex">
              <li
                @click="selectedItem = 'All'"
                class="is-clickable custom-item has-text-weight-semibold py-2 pr-4 is-size-5"
              >
                All
              </li>
              <li
                v-for="type in uniqueTypes"
                :key="type"
                @click="selectedItem = type"
                class="is-clickable custom-item has-text-weight-semibold py-2 px-4 is-size-5"
              >
                {{ type }}
              </li>
            </ul>
          </div>
          <div v-for="item in currentItems" :key="item.id">
            <Card :data="item" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.title-position {
  z-index: 4;
  top: 10px;
  display: inline;
}
.container-item {
  gap: 1rem;
  border: 1px solid #f7f7f7;
  max-height: 75vh;
  overflow-y: auto;
  position: relative;
}

.diffuse::before,
.diffuse::after {
  content: "";
  position: absolute;
  left: 0;
  width: calc(100% - 1rem);
  margin: 0 1px;
  height: 2rem;
  pointer-events: none;
  z-index: 2;
}

.diffuse::before {
  top: 1px;
  background: linear-gradient(to bottom, rgba(1, 1, 1, 1), rgba(247, 247, 247, 0));
}

.diffuse::after {
  bottom: 1px;
  background: linear-gradient(to top, rgba(1, 1, 1, 1), rgba(247, 247, 247, 0));
}

.custom-item {
  color: #f7f7f7;
  border-top: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: all 0.15s ease;
  &:hover {
    color: var(--gold);
    border-top: 1px solid var(--gold);
    border-left: 1px solid var(--gold);
    border-right: 1px solid var(--gold);
  }
}

.sticky {
  position: sticky;
  top: 0;
  z-index: 3;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  @media screen and (max-width: 764px) {
    display: none;
  }
}
</style>
