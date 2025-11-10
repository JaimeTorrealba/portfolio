<script setup>
import { useTresContext, useLoop } from "@tresjs/core";
import { Tree } from "@dgreenheck/ez-tree";

const { scene, camera } = useTresContext();

const createTree = (_x) => {
  const tree = new Tree();
  const randomScale = 2 + (Math.random() - 0.5);
  tree.scale.set(randomScale, randomScale, randomScale);
  tree.position.set(_x, -3.1, Math.random() * 40 - 100);
  tree.options.seed = Math.random() * 10000;
  tree.options.leaves.size = 0;
  tree.generate();
  trees.push(tree);
  scene.value.add(tree);
  return tree;
};

const trees = [];

createTree(Math.random() * 10 - 20);

setTimeout(() => {
  createTree(Math.random() * 10 + 10);
}, Math.random() * 5000);

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  if (trees.length > 0) {
    trees.forEach((tree) => {
      const treeMultiplier = 12.5;
      tree.position.z += delta * treeMultiplier;
      if (tree.position.z > camera.value.position.z + 10) {
        scene.value.remove(tree);
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
    <TresGroup />
</template>
