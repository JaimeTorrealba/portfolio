<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { Timeline } from "vue-timeline-chart";
import "vue-timeline-chart/style.css";
import { showText, appear } from "@/utils/gsaps.js";
import CloseButton from "@/components/common/CloseButton.vue";

const emit = defineEmits(["close"]);

const titleRef = ref(null);
const contentRef = ref(null);
const detailTimeline = ref(null);

const toTimestamp = (month, year) => Date.UTC(year, month - 1, 1);
const now = Date.now();

const groups = [
  { id: "frontend", label: "Front-end Developer" },
  { id: "ripley", label: "Full Stack Developer" },
  { id: "EDteam", label: "Educator" },
  { id: "push-security", label: "Senior Software Developer" },
  { id: "tres", label: "OSS maintainer" },
];

const items = [
  {
    id: "coaniquem",
    group: "frontend",
    type: "range",
    start: toTimestamp(2, 2017),
    end: toTimestamp(7, 2019),
    title: "Coaniquem",
    description: "Coaniquem is an NGO that helps children recovering from severe burns for free in Chile.",
    logo: "/img/logos/coaniquem.png",
  },
  {
    id: "ripley",
    group: "ripley",
    type: "range",
    start: toTimestamp(7, 2019),
    end: toTimestamp(3, 2022),
    title: "Ripley",
    cssVariables: { "--item-background": "hsl(38 85% 55%)" },
    description: "One of the biggest retail companies in Chile.",
    logo: "/img/logos/ripley.png",
  },
  {
    id: "lemu",
    group: "frontend",
    type: "range",
    start: toTimestamp(3, 2022),
    end: toTimestamp(9, 2022),
    title: "Lemu",
    description: "Lemu is a startup focused on conservation parks and wildlife.",
    logo: "/img/logos/lemu.png",
    logoClass: "logo-wide",
  },
  {
    id: "sky",
    group: "frontend",
    type: "range",
    start: toTimestamp(9, 2022),
    end: toTimestamp(4, 2024),
    title: "SKY",
    description: "SKY is one of the largest budget airlines in Latin America.",
    logo: "/img/logos/sky.svg",
  },
  {
    id: "three-js-course",
    group: "EDteam",
    type: "range",
    start: toTimestamp(5, 2023),
    end: toTimestamp(9, 2023),
    title: "EDteam",
    cssVariables: { "--item-background": "hsl(280 70% 60%)" },
    description: "EDteam famous platform (for online courses in Latin America).",
    logo: "/img/logos/edteam.svg",
  },
  {
    id: "push-security",
    group: "push-security",
    type: "range",
    start: toTimestamp(11, 2024),
    end: now,
    title: "Push Security",
    cssVariables: { "--item-background": "hsl(160 70% 45%)" },
    description: "Top leader in the browser security space.",
    logo: "/img/logos/push-security.svg",
  },
  {
    id: "tres-1",
    group: "tres",
    type: "range",
    start: toTimestamp(11, 2022),
    end: toTimestamp(10, 2024),
    title: "Tres.js",
    cssVariables: { "--item-background": "hsl(345 75% 55%)" },
    description: "Tres.js is an open-source library for building 3D experiences using Vue.js and Three.js.",
    logo: "/img/logos/tres-js.svg",
  },
  {
    id: "tres-2",
    group: "tres",
    type: "range",
    start: toTimestamp(10, 2025),
    end: now,
    title: "Tres.js",
    cssVariables: { "--item-background": "hsl(345 75% 55%)" },
    description: "Tres.js is an open-source library for building 3D experiences using Vue.js and Three.js.",
    logo: "/img/logos/tres-js.svg",
  },
];

const totalRange = { start: toTimestamp(1, 2017), end: now };
const viewport = ref({ start: toTimestamp(4, 2023), end: now });

const activeItem = ref(null);

const handleItemHover = ({ event, item }) => {
  if (event.pointerType !== "mouse") return;
  activeItem.value = item?.type === "range" ? item : null;
};

const handleItemTap = ({ event, item }) => {
  if (event.pointerType === "mouse") return;
  activeItem.value = item?.type === "range" && activeItem.value?.id !== item.id ? item : null;
};

const clearActiveItem = () => {
  activeItem.value = null;
};

const handleDetailViewportChange = (newViewport) => {
  viewport.value = newViewport;
  clearActiveItem();
};

const isDraggingMapViewport = ref(false);
let previousDragTimePos = 0;

const handleViewportDrag = ({ time, event, item }) => {
  if (event.type === "pointerdown") {
    if (item?.id !== "selection") return;
    isDraggingMapViewport.value = true;
    previousDragTimePos = time;
  } else if (event.type === "pointermove") {
    if (!isDraggingMapViewport.value) return;
    const delta = time - previousDragTimePos;
    const length = viewport.value.end - viewport.value.start;
    if (delta < 0) {
      viewport.value.start = Math.max(viewport.value.start + delta, totalRange.start);
      viewport.value.end = viewport.value.start + length;
    } else {
      viewport.value.end = Math.min(viewport.value.end + delta, totalRange.end);
      viewport.value.start = viewport.value.end - length;
    }
    previousDragTimePos = time;
  }
};

const stopDrag = () => {
  isDraggingMapViewport.value = false;
};

const onMapWheel = (event) => {
  detailTimeline.value?.onWheel(event);
};

onMounted(() => {
  window.addEventListener("pointerup", stopDrag, { capture: true });
  const master = gsap.timeline();
  master.add(showText(titleRef.value));
  master.add(appear(contentRef.value.querySelectorAll(".timeline-map, .timeline-detail")), 0.25);
});

onUnmounted(() => {
  window.removeEventListener("pointerup", stopDrag, { capture: true });
});
</script>

<template>
  <section class="container">
    <div class="glass3d">
      <CloseButton @click="emit('close')" />
      <div ref="contentRef" class="glass-content">
        <div class="overflow-hidden">
          <h1 ref="titleRef" class="is-size-1 has-text-light">Experience</h1>
        </div>
        <Timeline
          class="timeline-map"
          :class="{ 'is-dragging': isDraggingMapViewport }"
          :groups="groups"
          :items="[
            ...items,
            { id: 'selection', type: 'background', start: viewport.start, end: viewport.end },
          ]"
          :viewportMin="totalRange.start"
          :viewportMax="totalRange.end"
          :minViewportDuration="totalRange.end - totalRange.start"
          @pointermove="handleViewportDrag"
          @pointerdown="handleViewportDrag"
          @wheel="onMapWheel"
        />

        <Timeline
          ref="detailTimeline"
          class="timeline-detail"
          :groups="groups"
          :items="items"
          :viewportMin="totalRange.start"
          :viewportMax="totalRange.end"
          :initialViewportStart="viewport.start"
          :initialViewportEnd="viewport.end"
          :minTimestampWidth="60"
          @changeViewport="handleDetailViewportChange"
          @pointermove="handleItemHover"
          @pointerdown="handleItemTap"
          @mouseleaveTimeline="clearActiveItem"
        >
          <template #item="{ item }">
            <div class="timeline-item-content" :style="{ 'anchor-name': `--tl-${item.id}` }">
              {{ item.title }}
            </div>
          </template>
        </Timeline>

        <transition>
          <div
            v-if="activeItem"
            class="timeline-tooltip"
            :style="{ 'position-anchor': `--tl-${activeItem.id}` }"
          >
            <div class="timeline-tooltip-text">
              <p class="timeline-tooltip-title">{{ activeItem.title }}</p>
              <p>{{ activeItem.description }}</p>
            </div>
            <img
              :src="activeItem.logo"
              class="rounded"
              :class="activeItem.logoClass"
              :alt="`${activeItem.title} logo`"
              width="24"
              height="24"
            />
          </div>
        </transition>
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
  width: 70%;
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

.timeline-item-content {
  inset: 0;
  position: absolute;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--white);
}

.timeline-map,
.timeline-detail {
  opacity: 0;
}

.timeline-map {
  --group-items-height: 0.5em;
  --group-border-top: 0;
  --label-padding: 0.1em 0.4em;
  --group-padding-top: 0.1em;
  --group-padding-bottom: 0.1em;
  color: var(--white);

  &:deep(.group-label) {
    font-size: 0.65rem;
  }

  &:deep(.group:first-of-type) {
    padding-top: 0.75rem;
  }

  &:deep(.group:last-of-type) {
    padding-bottom: 0.75rem;
  }

  &:deep(.background) {
    --item-background: hsl(0 0% 100% / 0.15);
    cursor: grab;
    z-index: 1;
  }

  &.is-dragging,
  &.is-dragging:deep(.background) {
    cursor: grabbing;
  }

  &:deep(.item) {
    pointer-events: none;
  }
}

.timeline-detail {
  --group-items-height: 2.75rem;
  color: var(--white);

  &:deep(.group-label) {
    display: none;
  }
}

.timeline-tooltip {
  position: fixed;
  position-area: top;
  position-try-fallbacks: flip-block;
  position-visibility: anchors-visible;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 20;
  max-width: 280px;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid hsla(0, 0%, 35%, 0.5);
  background: hsl(189 80% 10% / 0.85);
  color: var(--white);
  font-size: 0.75rem;
  pointer-events: none;

  & img {
    flex-shrink: 0;
  }

  & img.logo-wide {
    background: #f7f7f7;
    aspect-ratio: 16 / 9;
    height: 24px;
    width: auto;
    padding: 0.25rem;
    object-fit: contain;
  }
}

.timeline-tooltip-title {
  font-size: 0.85rem;
  font-weight: 600;
}

.timeline-tooltip.v-enter-active,
.timeline-tooltip.v-leave-active {
  transition: opacity 0.25s ease;
}

.timeline-tooltip.v-enter-from,
.timeline-tooltip.v-leave-to {
  opacity: 0;
}

@supports not (anchor-name: --a) {
  .timeline-tooltip {
    display: none;
  }
}

.container :deep(.glass-surface) {
  overflow: visible;
}

.glass3d {
  --filter-glass3d: blur(8px) brightness(0.4) saturate(1.5);
  --color-glass3d: hsl(189 80% 10% / 0.2);
  border-radius: 1rem;
  min-width: 600px;
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

.rounded{
  border-radius: 4px;
}
</style>
