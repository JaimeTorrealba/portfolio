<script setup>
import { shallowRef, onMounted } from "vue";
import { useLoop } from "@tresjs/core";
import {
  CanvasTexture, AdditiveBlending,
  Sprite, SpriteMaterial,
  SphereGeometry, MeshBasicMaterial, Mesh,
} from "three";

function createGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0,    "rgba(220, 235, 255, 0.9)");
  g.addColorStop(0.25, "rgba(170, 200, 245, 0.5)");
  g.addColorStop(0.6,  "rgba(120, 160, 220, 0.15)");
  g.addColorStop(1,    "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

// Build objects imperatively — avoids TresJS namespace issues with non-mesh types
const glowSprite = new Sprite(
  new SpriteMaterial({
    map: createGlowTexture(),
    transparent: true,
    depthWrite: false,
    fog: false,
    blending: AdditiveBlending,
  })
);
glowSprite.position.set(0, 45, -449.8);
glowSprite.scale.set(32, 32, 1);

const moonMesh = new Mesh(
  new SphereGeometry(1, 16, 16),
  new MeshBasicMaterial({ color: 0xdce8f5, fog: false })
);
moonMesh.position.set(0, 45, -450);

const groupRef = shallowRef();

onMounted(() => {
  groupRef.value.add(glowSprite);
  groupRef.value.add(moonMesh);
});

const { onBeforeRender } = useLoop();
onBeforeRender(({ elapsed }) => {
  const s = 1.0 + Math.sin(elapsed * 0.11) * 0.018;
  moonMesh.scale.setScalar(s * 4.5);
});
</script>

<template>
  <TresGroup ref="groupRef" />
</template>
