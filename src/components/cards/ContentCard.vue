<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { showText } from "@/utils/gsaps.js";
import { items } from "@/utils/items.js";
import CloseButton from "@/components/common/CloseButton.vue";
gsap.registerPlugin(SplitText);

const emit = defineEmits(["close"]);

const talksItems = items.filter(
  (item) => item.type === "Talk" || item.type === "Podcast"
);

const titleRef = ref(null);
const listRef = ref(null);

onMounted(() => {
  const master = gsap.timeline();
  master.add(showText(titleRef.value));
  master.fromTo(
    listRef.value.children,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
    "-=0.3"
  );
});
</script>

<template>
  <section class="container">
    <div class="glass3d">
      <CloseButton @click="emit('close')" />
      <div class="glass-content">
        <div class="overflow-hidden">
          <h1 ref="titleRef" class="is-size-1 has-text-light">Talks & Podcasts</h1>
        </div>
        <ul ref="listRef" class="talks-list">
          <li v-for="item in talksItems" :key="item.id" class="talk-item">
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="talk-title has-text-light"
            >
              <div class="talk-body">
                {{ item.title }}
                <p class="talk-description">{{ item.description }}</p>
              </div>
            </a>
            <span class="talk-type" :data-type="item.type">{{ item.type }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  overflow: visible;
  width: 50%;
  @media screen and (max-width: 1024px) {
    position: fixed;
    top: 5%;
    left: 0;
    transform: translate(0, 0);
    min-height: 100vh;
    width: 100%;
    padding: 0 0.5rem;
  }
}

.glass-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  width: 100%;
  height: 100%;
}

.overflow-hidden {
  overflow: hidden;
}

.talks-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.talks-list::-webkit-scrollbar {
  width: 4px;
}
.talks-list::-webkit-scrollbar-track {
  background: transparent;
}
.talks-list::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 60%, 0.3);
  border-radius: 2px;
}

.talk-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 0.625rem;
  background: hsla(0, 0%, 100%, 0.04);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  transition: background 0.2s ease;
}

.talk-item:hover {
  background: hsla(0, 0%, 100%, 0.08);
}

.talk-type {
  flex-shrink: 0;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.2rem;
  color: hsl(189 80% 80%);
  background: hsl(189 80% 10% / 0.4);
  border: 1px solid hsl(189 80% 40% / 0.3);
}

.talk-type[data-type="Podcast"] {
  color: hsl(280 70% 80%);
  background: hsl(280 70% 10% / 0.4);
  border-color: hsl(280 70% 40% / 0.3);
}

.talk-body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.talk-title {
  font-family: "sentient";
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.talk-title:hover {
  opacity: 0.75;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.talk-description {
  font-size: 0.8rem;
  color: hsla(0, 0%, 75%, 0.8);
  line-height: 1.45;
}

.container :deep(.glass-surface) {
  overflow: visible;
}

.glass3d {
  --filter-glass3d: blur(8px) brightness(0.4) saturate(1.5);
  --color-glass3d: hsl(189 80% 10% / 0.2);
  border-radius: 1rem;
  min-width: 400px;
  border: 1px solid hsla(0, 0%, 35%, 0.5);

  position: relative;
  z-index: 4;
  box-shadow: 0 0 0.75px hsl(205 20% 10% / 0.2),
    0.7px 0.8px 1.2px -0.4px hsl(205 20% 10% / 0.1),
    1.3px 1.5px 2.2px -0.8px hsl(205 20% 10% / 0.1),
    2.3px 2.6px 3.9px -1.2px hsl(205 20% 10% / 0.1),
    3.9px 4.4px 6.6px -1.7px hsl(205 20% 10% / 0.1),
    6.5px 7.2px 10.9px -2.1px hsl(205 20% 10% / 0.1),
    8px 9px 14px -2.5px hsl(205 20% 10% / 0.2);
}

.glass3d::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 3;

  -webkit-backdrop-filter: var(--filter-glass3d);
  backdrop-filter: var(--filter-glass3d);
}

.glass3d::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 5;

  box-shadow: inset 2px 2px 1px -3px hsl(205 20% 90% / 0.8),
    inset 4px 4px 2px -6px hsl(205 20% 90% / 0.3),
    inset 1.5px 1.5px 1.5px -0.75px hsl(205 20% 90% / 0.15),
    inset 1.5px 1.5px 0.25px hsl(205 20% 90% / 0.03),
    inset 0 0 0.25px 0.5px hsl(205 20% 90% / 0.03);
}

.glass3d > * {
  position: relative;
  z-index: 6;
}
</style>
