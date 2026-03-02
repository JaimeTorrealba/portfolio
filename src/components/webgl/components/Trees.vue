<script setup>
import { reactive, onMounted, shallowRef, nextTick } from "vue";
import { useTres, useLoop } from "@tresjs/core";
import { Tree } from "@dgreenheck/ez-tree";
import { usePaneStore } from "@/stores/pane";


const { camera } = useTres();
const options = reactive({
  treeCount: 1,
  speed: 12.5,
  visible: true,
});

const TREE_SIDE_MIN = 10;
const TREE_SIDE_SPREAD = 7.5;

const getRandomTreeX = (side = Math.random() < 0.5 ? -1 : 1) =>
  side * (TREE_SIDE_MIN + Math.random() * TREE_SIDE_SPREAD);

onMounted(async () => {
  await nextTick();
  for (let i = 0; i < options.treeCount; i++) {
    const side = i < 2 ? (i === 0 ? -1 : 1) : Math.random() < 0.5 ? -1 : 1;
    createTree(getRandomTreeX(side));
  }
  if (!window.location.href.includes("#debug")) return;
  const store = usePaneStore();
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Trees", expanded: false });
  folder.addBinding(options, "visible");
  folder.addBinding(options, "speed", { min: 0, max: 50, step: 0.5 });
  folder.addBinding(options, "treeCount", { min: 1, max: 10, step: 1 });
});


const treesRef = shallowRef();
const createTree = (_x) => {
  const tree = new Tree();
  const randomScale = 2 + (Math.random() - 0.5) * 2;
  tree.scale.set(randomScale, randomScale, randomScale);
  tree.position.set(_x, 0, Math.random() * 100 - 125);
  tree.options.seed = Math.random() * 10000;
  tree.options.leaves.size = 0;
  tree.generate();
  trees.push(tree);
  treesRef.value.add(tree);
  return tree;
};

const trees = [];

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  if (trees.length > 0) {
    trees.forEach((tree) => {
      tree.position.z += delta * options.speed;
      if (tree.position.z > camera.value.position.z + 15) {
        treesRef.value.remove(tree);
        trees.splice(trees.indexOf(tree), 1);
        createTree(getRandomTreeX());
      }
    });
  }
});
</script>
<template>
    <TresGroup :position-y="-5.1" ref="treesRef" :visible="options.visible" />
</template>
