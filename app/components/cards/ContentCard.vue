<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { showText } from "@/utils/gsaps.js";
import CloseButton from "@/components/common/CloseButton.vue";
import AnimatedList from "@/components/common/AnimatedList.vue";
import { content } from "#shared/profile";

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
  <section class="container" role="dialog" aria-modal="true" aria-labelledby="content-card-title">
    <div class="glass3d">
      <CloseButton @click="emit('close')" />
      <div class="glass-content">
        <div class="overflow-hidden">
          <h2 id="content-card-title" ref="titleRef" class="is-size-1">Content</h2>
        </div>
        <AnimatedList
          :items="content"
          list-class="talks-list"
          item-class="talk-item"
        >
          <template #default="{ item }">
            <!-- Items without a public link render as plain text, not an empty href. -->
            <component
              :is="item.url ? 'a' : 'div'"
              v-bind="item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {}"
              class="talk-title"
            >
              <div class="talk-body">
                <span :lang="item.lang">{{ item.title }}</span>
                <p class="talk-description">{{ item.description }}</p>
              </div>
            </component>
            <span class="talk-type" :data-type="item.type">{{ item.type }}</span>
          </template>
        </AnimatedList>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  position: fixed;
  top: 25%;
  left: 50%;
  /* Where the card has always rendered: GSAP's open animation used to override the
     old -25% with 0, and now hands positioning back to this rule when it finishes. */
  transform: translate(-50%, 0);
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

/* The list and its items are rendered by AnimatedList, hence :deep(). */
:deep(.talks-list) {
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

:deep(.talks-list::-webkit-scrollbar) {
  width: 4px;
}
:deep(.talks-list::-webkit-scrollbar-track) {
  background: transparent;
}
:deep(.talks-list::-webkit-scrollbar-thumb) {
  background: hsla(0, 0%, 60%, 0.3);
  border-radius: 2px;
}

:deep(.talk-item) {
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

:deep(.talk-item:hover),
:deep(.talk-item.is-selected) {
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

.talk-type[data-type="Course"] {
  color: hsl(38 90% 80%);
  background: hsl(38 90% 10% / 0.4);
  border-color: hsl(38 90% 40% / 0.3);
}

.talk-type[data-type="OSS"] {
  color: hsl(142 60% 75%);
  background: hsl(142 60% 8% / 0.4);
  border-color: hsl(142 60% 35% / 0.3);
}

.talk-type[data-type="game"] {
  color: hsl(340 75% 80%);
  background: hsl(340 75% 10% / 0.4);
  border-color: hsl(340 75% 40% / 0.3);
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

a.talk-title:hover {
  opacity: 0.75;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.talk-description {
  font-size: 0.8rem;
  color: hsla(0, 0%, 75%, 0.8);
  line-height: 1.45;
}
</style>
<style scoped src="./GlassCard.css"></style>
