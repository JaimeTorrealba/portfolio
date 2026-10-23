<script setup>
import { watch, onUnmounted } from "vue";
import { useTres } from "@tresjs/core";
import { DefaultLoadingManager } from "three";
import { useMainStore } from "@/stores";

// On a static scene (store.staticScene) Tres only renders when the frame is invalidated.
// Changes made through Tres components do that on their own; these two don't:
//  - textures that finish decoding after the first frame. Floor, Clouds and every ez-tree
//    texture load through three's DefaultLoadingManager, whose onLoad fires once a batch
//    is done -- one repaint per batch, not per texture, since each frame is expensive on
//    the devices this is for.
//  - Trees.vue adds its trees with a raw `add()`. Repainting at the reveal covers them.
// invalidate() is a no-op while rendering every frame, so this is safe to leave mounted.
const { invalidate } = useTres();
const mainStore = useMainStore();

const previousOnLoad = DefaultLoadingManager.onLoad;
const repaintOnTexturesLoaded = () => {
  previousOnLoad?.();
  invalidate();
};
DefaultLoadingManager.onLoad = repaintOnTexturesLoaded;

watch(
  () => mainStore.finishLoading,
  (done) => {
    if (done) invalidate();
  }
);

onUnmounted(() => {
  if (DefaultLoadingManager.onLoad === repaintOnTexturesLoaded) {
    DefaultLoadingManager.onLoad = previousOnLoad;
  }
});
</script>
<template>
  <TresGroup />
</template>
