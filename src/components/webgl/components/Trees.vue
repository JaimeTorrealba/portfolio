<script setup>
import { reactive, onMounted, shallowRef, nextTick } from "vue";
import { useTres, useLoop } from "@tresjs/core";
import { Tree } from "@dgreenheck/ez-tree";
import { usePaneStore } from "@/stores/pane";

const store = usePaneStore();
const { camera } = useTres();
const options = reactive({
  treeCount: 2,
  speed: 12.5,
  visible: true,
});

onMounted(async () => {
  await nextTick();
    for (let i = 0; i < options.treeCount; i++){
    let xPos = Math.random() * (10 * i) - 10;
    if (xPos > -5 && xPos < 5) xPos *= 1.5;
    createTree(xPos);
  }
  if (!window.location.href.includes("#debug")) return;
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Trees" });
  folder.addBinding(options, "visible");
  folder.addBinding(options, "speed", { min: 0, max: 50, step: 0.5 });
  folder.addBinding(options, "treeCount", { min: 1, max: 10, step: 1 });
});


const treesRef = shallowRef();
const createTree = (_x) => {
  const tree = new Tree();
  const randomScale = 2 + (Math.random() - 0.5) * 2;
  tree.scale.set(randomScale, randomScale, randomScale);
  tree.position.set(_x, 0, Math.random() * 100 - 100);
  tree.options.seed = Math.random() * 10000;
  tree.options.leaves.size = 0;
  tree.generate();
  trees.push(tree);
  treesRef.value.add(tree);
  return tree;
};

const trees = [];

setTimeout(() => {
  for (let i = 0; i < options.treeCount; i++){
    createTree(Math.random() * 10 + 10);
  }
}, Math.random() * 5000);

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  if (trees.length > 0) {
    trees.forEach((tree) => {;
      tree.position.z += delta * options.speed;
      if (tree.position.z > camera.value.position.z + 10) {
        treesRef.value.remove(tree);
        trees.splice(trees.indexOf(tree), 1);
        const leftRight =
          tree.position.x < 0 ? Math.random() * 10 - 20 : Math.random() * 10 + 10;
        createTree(leftRight);
      }
    });
  }
});
</script>
<template>
    <TresGroup :position-y="-4.1" ref="treesRef" :visible="options.visible" />
</template>
