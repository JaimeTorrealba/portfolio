<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { showText } from "@/utils/gsaps.js";
import CloseButton from "@/components/common/CloseButton.vue";
import AnimatedList from "@/components/common/AnimatedList.vue";
import { experiences } from "#shared/profile";

const emit = defineEmits(["close"]);

const titleRef = ref(null);

let titleContext = null;
onMounted(() => {
  titleContext = gsap.context(() => showText(titleRef.value));
});
// Kill, not revert: the card is still fading out when this runs.
onBeforeUnmount(() => titleContext?.kill());
</script>

<template>
  <section class="container" role="dialog" aria-modal="true" aria-labelledby="experience-card-title">
    <div class="glass3d">
      <CloseButton @click="emit('close')" />
      <div class="glass-content">
        <div class="overflow-hidden">
          <h2 id="experience-card-title" ref="titleRef" class="is-size-1">Experience</h2>
        </div>
        <AnimatedList :items="experiences" list-class="experience-list" item-class="experience-item">
          <template #default="{ item }">
            <img
              :src="item.logo"
              class="experience-logo"
              :style="item.logoBg && { background: item.logoBg }"
              :alt="`${item.title} logo`"
              width="36"
              height="36"
            />
            <div class="experience-body">
              <p class="experience-title">{{ item.title }}</p>
              <p class="experience-period">{{ item.period }}</p>
              <p class="experience-description">{{ item.description }}</p>
            </div>
            <span class="experience-role" :data-role="item.role">{{ item.role }}</span>
          </template>
        </AnimatedList>
      </div>
    </div>
  </section>
</template>

<style scoped>
.glass-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  width: 100%;
  height: 100%;
}

/* The list and its items are rendered by AnimatedList, hence :deep(). */
:deep(.experience-list) {
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

:deep(.experience-list::-webkit-scrollbar) {
  width: 4px;
}
:deep(.experience-list::-webkit-scrollbar-track) {
  background: transparent;
}
:deep(.experience-list::-webkit-scrollbar-thumb) {
  background: hsla(0, 0%, 60%, 0.3);
  border-radius: 2px;
}

:deep(.experience-item) {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 0.625rem;
  background: hsla(0, 0%, 100%, 0.04);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  transition: background 0.2s ease;
}

:deep(.experience-item:hover),
:deep(.experience-item.is-selected) {
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
  /* 0.8 like the description: 0.6 measured about 4.4:1 over the glass, under 4.5:1. */
  color: hsla(0, 0%, 75%, 0.8);
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
  :deep(.experience-item) {
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
</style>
<style scoped src="./GlassCard.css"></style>
