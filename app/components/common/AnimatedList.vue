<script setup>
// GSAP + IntersectionObserver port of Vue Bits' AnimatedList
// (https://vue-bits.dev/components/animated-list), which is built on motion-v.
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/utils/motion.js";

const props = defineProps({
  items: { type: Array, required: true },
  itemKey: { type: String, default: "id" },
  listClass: { type: [String, Array, Object], default: "" },
  itemClass: { type: [String, Array, Object], default: "" },
  showGradients: { type: Boolean, default: true },
  enableArrowNavigation: { type: Boolean, default: true },
});

// itemPointerEnter hands the raw event up, so a parent can react to the pointer
// reaching an item (ContentCard.vue plays its hover sound).
const emit = defineEmits(["itemSelected", "itemPointerEnter"]);

// Distance (px) over which the edge fades ramp up, and the margin kept around
// a keyboard-selected item when scrolling it into view — both from Vue Bits.
const FADE_DISTANCE = 50;
const SCROLL_MARGIN = 50;

const listRef = ref(null);
const selectedIndex = ref(-1);
const fadeTop = ref(0);
const fadeBottom = ref(0);
let itemObserver = null;

const getItemElements = () => Array.from(listRef.value?.children ?? []);

const animateItemsIn = (targets) =>
  gsap.to(targets, {
    scale: 1,
    opacity: 1,
    duration: 0.2,
    delay: 0.1,
    stagger: 0.05,
    ease: "power2.out",
    overwrite: true,
  });

const animateItemsOut = (targets) =>
  gsap.to(targets, { scale: 0.7, opacity: 0, duration: 0.2, ease: "power2.in", overwrite: true });

const handleItemVisibility = (entries) => {
  const enteringItems = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
  const leavingItems = entries.filter((entry) => !entry.isIntersecting).map((entry) => entry.target);
  if (enteringItems.length) animateItemsIn(enteringItems);
  if (leavingItems.length) animateItemsOut(leavingItems);
};

const updateEdgeFades = () => {
  const listElement = listRef.value;
  if (!listElement) return;
  const { scrollTop, scrollHeight, clientHeight } = listElement;
  const distanceToBottom = scrollHeight - scrollTop - clientHeight;
  fadeTop.value = Math.min(scrollTop / FADE_DISTANCE, 1);
  fadeBottom.value = distanceToBottom <= 0 ? 0 : Math.min(distanceToBottom / FADE_DISTANCE, 1);
};

const getScrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");

const scrollSelectedIntoView = () => {
  const listElement = listRef.value;
  const selectedElement = getItemElements()[selectedIndex.value];
  if (!listElement || !selectedElement) return;
  const { scrollTop, clientHeight } = listElement;
  const itemTop = selectedElement.offsetTop;
  const itemBottom = itemTop + selectedElement.offsetHeight;
  if (itemTop < scrollTop + SCROLL_MARGIN) {
    listElement.scrollTo({ top: itemTop - SCROLL_MARGIN, behavior: getScrollBehavior() });
  } else if (itemBottom > scrollTop + clientHeight - SCROLL_MARGIN) {
    listElement.scrollTo({
      top: itemBottom - clientHeight + SCROLL_MARGIN,
      behavior: getScrollBehavior(),
    });
  }
};

// Arrow keys move real focus, not only the highlight, so screen readers announce the
// item: its link when it has one, otherwise the item itself (tabindex="-1").
const focusItem = (index) => {
  const itemElement = getItemElements()[index];
  if (!itemElement) return;
  selectedIndex.value = index;
  (itemElement.querySelector("a[href], button") ?? itemElement).focus({ preventScroll: true });
  nextTick(scrollSelectedIntoView);
};

// Only the arrow keys are taken over. Vue Bits also steps through items on Tab, which
// traps keyboard users inside the list; here Tab moves through the page as usual.
const handleListKeydown = (event) => {
  if (!props.enableArrowNavigation) return;
  const lastIndex = props.items.length - 1;
  const selectedElement = getItemElements()[selectedIndex.value];

  if (event.key === "ArrowDown") {
    event.preventDefault();
    focusItem(Math.min(selectedIndex.value + 1, lastIndex));
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    focusItem(Math.max(selectedIndex.value - 1, 0));
  } else if (event.key === "Enter" && selectedElement && event.target === selectedElement) {
    // A focused link opens by itself; this covers items that have no link.
    event.preventDefault();
    emit("itemSelected", props.items[selectedIndex.value], selectedIndex.value);
  }
};

onMounted(() => {
  updateEdgeFades();
  const itemElements = getItemElements();
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    gsap.set(itemElements, { scale: 1, opacity: 1 });
    return;
  }
  gsap.set(itemElements, { scale: 0.7, opacity: 0 });
  itemObserver = new IntersectionObserver(handleItemVisibility, {
    root: listRef.value,
    threshold: 0.5,
  });
  itemElements.forEach((itemElement) => itemObserver.observe(itemElement));
});

onBeforeUnmount(() => {
  itemObserver?.disconnect();
  gsap.killTweensOf(getItemElements());
});
</script>

<template>
  <ul
    ref="listRef"
    :class="[listClass, 'animated-list', { 'has-edge-fades': showGradients }]"
    :style="{ '--fade-top': fadeTop, '--fade-bottom': fadeBottom }"
    tabindex="0"
    @scroll="updateEdgeFades"
    @keydown="handleListKeydown"
    @mouseleave="selectedIndex = -1"
  >
    <li
      v-for="(item, index) in items"
      :key="item[itemKey]"
      :class="[itemClass, { 'is-selected': index === selectedIndex }]"
      tabindex="-1"
      @focusin="selectedIndex = index"
      @mouseenter="selectedIndex = index"
      @pointerenter="emit('itemPointerEnter', $event)"
      @click="selectedIndex = index"
    >
      <slot :item="item" :index="index" :selected="index === selectedIndex" />
    </li>
  </ul>
</template>

<style scoped>
.animated-list {
  /* offsetTop of the items is measured against the list when auto-scrolling */
  position: relative;
}

.animated-list:focus {
  outline: none;
}

/* Drawn inside the box: the edge-fade mask clips anything painted outside it. */
.animated-list:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -2px;
  border-radius: 0.625rem;
}

/* Vue Bits paints solid gradient overlays; the cards are translucent glass, so
   the list content itself is masked out at the edges instead. */
.has-edge-fades {
  --edge-fade-top: linear-gradient(
    to bottom,
    rgb(0 0 0 / calc(1 - var(--fade-top))) 0,
    #000 50px
  );
  --edge-fade-bottom: linear-gradient(
    to top,
    rgb(0 0 0 / calc(1 - var(--fade-bottom))) 0,
    #000 100px
  );
  -webkit-mask-image: var(--edge-fade-top), var(--edge-fade-bottom);
  -webkit-mask-composite: source-in;
  mask-image: var(--edge-fade-top), var(--edge-fade-bottom);
  mask-composite: intersect;
}
</style>
