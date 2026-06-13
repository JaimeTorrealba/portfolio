<script setup>
import { reactive, onMounted, shallowRef, nextTick } from "vue";
import { useTres, useLoop } from "@tresjs/core";
import { Tree } from "@dgreenheck/ez-tree";
import { usePaneStore } from "@/stores/pane";
import gsap from "gsap";


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

const disposeTree = (tree) => {
  tree.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach((m) => m.dispose());
    } else {
      child.material.dispose();
    }
  });
};

const fadeInTree = (tree) => {
  tree.traverse((child) => {
    if (!child.isMesh) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      mat.transparent = true;
      mat.opacity = 0;
      gsap.to(mat, {
        opacity: 1,
        duration: 1,
        onComplete: () => { mat.transparent = false; },
      });
    });
  });
};

const createTree = (_x) => {
  const tree = new Tree();
  const randomScale = 2 + (Math.random() - 0.5) * 2;
  tree.scale.set(randomScale, randomScale, randomScale);
  tree.position.set(_x, 0, Math.random() * 100 - 125);
  tree.options.seed = Math.random() * 10000;
  tree.options.leaves.size = 0;
  tree.generate();
  fadeInTree(tree);
  trees.push(tree);
  treesRef.value.add(tree);
  return tree;
};

const trees = [];

// Pre-generate one spare tree to avoid geometry generation spikes in the render loop
let spareTree = null;
const buildSpare = () => {
  setTimeout(() => {
    const t = new Tree();
    t.options.seed = Math.random() * 10000;
    t.options.leaves.size = 0;
    t.generate();
    spareTree = t;
  }, 0);
};

onMounted(async () => {
  await nextTick();
  buildSpare();
});

const respawnTree = (_x) => {
  if (spareTree) {
    const tree = spareTree;
    spareTree = null;
    const randomScale = 2 + (Math.random() - 0.5) * 2;
    tree.scale.set(randomScale, randomScale, randomScale);
    tree.position.set(_x, 0, Math.random() * 100 - 125);
    fadeInTree(tree);
    trees.push(tree);
    treesRef.value.add(tree);
    buildSpare();
    return;
  }
  // Fallback if spare isn't ready yet
  createTree(_x);
};

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  if (trees.length === 0) return;
  for (let i = trees.length - 1; i >= 0; i--) {
    const tree = trees[i];
    tree.position.z += delta * options.speed;
    if (tree.position.z > camera.value.position.z + 15) {
      treesRef.value.remove(tree);
      disposeTree(tree);
      trees.splice(i, 1);
      respawnTree(getRandomTreeX());
    }
  }
});
</script>
<template>
    <TresGroup :position-y="-5.1" ref="treesRef" :visible="options.visible" />
</template>
