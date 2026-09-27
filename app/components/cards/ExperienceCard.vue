<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";
import { showText } from "@/utils/gsaps.js";
import { prefersReducedMotion } from "@/utils/motion.js";
import CloseButton from "@/components/common/CloseButton.vue";
import { experiences } from "#shared/profile";

const emit = defineEmits(["close"]);

const titleRef = ref(null);
const listRef = ref(null);

onMounted(() => {
  const master = gsap.timeline();
  master.add(showText(titleRef.value));
  if (prefersReducedMotion()) {
    gsap.set(listRef.value.children, { opacity: 1, y: 0 });
    return;
  }
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
          <h1 ref="titleRef" class="is-size-1 has-text-light">Experience</h1>
        </div>
        <ul ref="listRef" class="experience-list">
          <li v-for="item in experiences" :key="item.id" class="experience-item">
            <img
              :src="item.logo"
              class="experience-logo"
              :style="item.logoBg && { background: item.logoBg }"
              :alt="`${item.title} logo`"
              width="36"
              height="36"
            />
            <div class="experience-body">
              <p class="experience-title has-text-light">{{ item.title }}</p>
              <p class="experience-period">{{ item.period }}</p>
              <p class="experience-description">{{ item.description }}</p>
            </div>
            <span class="experience-role" :data-role="item.role">{{ item.role }}</span>
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
  transform: translate(-50%, -25%);
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

.experience-list {
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

.experience-list::-webkit-scrollbar {
  width: 4px;
}
.experience-list::-webkit-scrollbar-track {
  background: transparent;
}
.experience-list::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 60%, 0.3);
  border-radius: 2px;
}

.experience-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 0.625rem;
  background: hsla(0, 0%, 100%, 0.04);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  transition: background 0.2s ease;
}

.experience-item:hover {
  background: hsla(0, 0%, 100%, 0.08);
}

.experience-logo {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 4px;
  border-radius: 6px;
  background: #f7f7f7;
  object-fit: contain;
}

.experience-body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
}

.experience-title {
  font-family: "sentient";
  font-size: 1rem;
}

.experience-period {
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: hsla(0, 0%, 75%, 0.6);
}

.experience-description {
  font-size: 0.8rem;
  color: hsla(0, 0%, 75%, 0.8);
  line-height: 1.45;
}

.experience-role {
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

.experience-role[data-role="Full Stack Developer"] {
  color: hsl(38 90% 80%);
  background: hsl(38 90% 10% / 0.4);
  border-color: hsl(38 90% 40% / 0.3);
}

.experience-role[data-role="Educator"] {
  color: hsl(280 70% 80%);
  background: hsl(280 70% 10% / 0.4);
  border-color: hsl(280 70% 40% / 0.3);
}

.experience-role[data-role="Senior Software Developer"] {
  color: hsl(160 70% 75%);
  background: hsl(160 70% 8% / 0.4);
  border-color: hsl(160 70% 35% / 0.3);
}

.experience-role[data-role="OSS maintainer"] {
  color: hsl(345 75% 80%);
  background: hsl(345 75% 10% / 0.4);
  border-color: hsl(345 75% 40% / 0.3);
}

@media screen and (max-width: 640px) {
  .experience-item {
    flex-wrap: wrap;
  }
  .experience-body {
    /* fill the rest of line 1 so the role badge always wraps below,
       instead of only when its label happens to be wide enough */
    flex-basis: calc(100% - 36px - 0.875rem);
  }
  .experience-role {
    margin-top: 0;
    margin-left: calc(36px + 0.875rem);
  }
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
  @media screen and (max-width: 1024px) {
    min-width: 0;
  }

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
