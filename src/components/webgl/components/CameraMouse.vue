<script setup>
import { useLoop, useTres } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { computed, reactive, onMounted } from "vue";
import { usePaneStore } from "@/stores/pane";
import { useMainStore } from "@/stores";

const { camera } = useTres();
const mainStore = useMainStore();

const TAU = Math.PI * 2;
const REST_Y = 5;
// The look clamp has to leave room for the heading wander on top of the cursor.
const LOOK_LIMIT = 0.32;

const options = reactive({
  factor: 0.25,
  ease: 2.5,
  headbobEnabled: true,
  // Gait. A stride is two footfalls: the body rises and falls once per footfall,
  // but sways and rolls once per full stride, which is why the lateral channels
  // run at half the step rate. The old single sine did the vertical only, and a
  // metronomic vertical bob on its own is what reads as a treadmill.
  stepFrequency: 1.25,
  bobVertical: 0.1,
  bobLateral: 0.09,
  bobRoll: 0.011,
  cadenceJitter: 0.07,
  // Nobody holds a heading or walks a straight line for long.
  headingDrift: 0.06,
  pathDrift: 0.9,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const paneStore = usePaneStore();
  const pane = paneStore.pane;
  const folder = pane.addFolder({ title: "Camera Mouse", expanded: false });

  folder.addBinding(options, "factor", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "ease", { min: 0, max: 10, step: 0.1 });
  folder.addBinding(options, "headbobEnabled");

  const gaitFolder = folder.addFolder({ title: "Gait" });
  gaitFolder.addBinding(options, "stepFrequency", { min: 0.2, max: 4, step: 0.01 });
  gaitFolder.addBinding(options, "bobVertical", { min: 0, max: 1, step: 0.005 });
  gaitFolder.addBinding(options, "bobLateral", { min: 0, max: 1, step: 0.005 });
  gaitFolder.addBinding(options, "bobRoll", { min: 0, max: 0.1, step: 0.001 });
  gaitFolder.addBinding(options, "cadenceJitter", { min: 0, max: 0.4, step: 0.005 });

  const wanderFolder = folder.addFolder({ title: "Wander" });
  wanderFolder.addBinding(options, "headingDrift", { min: 0, max: 0.3, step: 0.005 });
  wanderFolder.addBinding(options, "pathDrift", { min: 0, max: 3, step: 0.05 });
});


const { x, y } = useMouse();
const { width, height } = useWindowSize();

const cursorX = computed(() => -(x.value / width.value - 0.5) * options.factor);
const cursorY = computed(() => -(y.value / height.value - 0.5) * options.factor * 0.5);

const { onBeforeRender } = useLoop();

// Accumulated rather than derived from `elapsed`, because the cadence wobbles:
// multiplying absolute time by a varying rate would slide the whole gait back and
// forth, where adding a varying increment only changes the length of the next step.
let stepPhase = 0;
let restSynced = false;

onBeforeRender(({ elapsed, delta }) => {
  // Unrequested viewpoint motion is the main vestibular trigger here: keep the
  // camera locked to its resting transform when reduced motion is preferred.
  if (mainStore.reducedMotion) {
    // Settle onto the rest pose once instead of freezing mid-stride.
    if (restSynced) return;
    restSynced = true;
    camera.value.position.x = 0;
    camera.value.position.y = REST_Y;
    camera.value.rotation.z = 0;
    return;
  }
  restSynced = false;

  // Two periods that share no common multiple, so the wander never visibly loops.
  const headingWander =
    Math.sin(elapsed * 0.061) * 0.55 + Math.sin(elapsed * 0.023) * 0.45;
  const pathWander =
    Math.sin(elapsed * 0.043) * 0.6 + Math.sin(elapsed * 0.017) * 0.4;

  const targetYaw = cursorX.value + headingWander * options.headingDrift;
  const xMove = (targetYaw - camera.value.rotation.y) * delta * options.ease;
  const yMove = (cursorY.value - camera.value.rotation.x) * delta * options.ease;
  camera.value.rotation.x += yMove;
  camera.value.rotation.x = Math.max(-LOOK_LIMIT, Math.min(LOOK_LIMIT, camera.value.rotation.x));
  camera.value.rotation.y += xMove;
  camera.value.rotation.y = Math.max(-LOOK_LIMIT, Math.min(LOOK_LIMIT, camera.value.rotation.y));

  const lane = pathWander * options.pathDrift;

  if (options.headbobEnabled) {
    const cadence = 1 + Math.sin(elapsed * 0.37) * options.cadenceJitter;
    stepPhase += delta * TAU * options.stepFrequency * cadence;
    const stride = stepPhase * 0.5;

    // The second harmonic sharpens the drop onto the leading foot, so it lands as
    // a heel strike rather than floating up and down like a buoy.
    const rise = Math.sin(stepPhase) - Math.sin(stepPhase * 2) * 0.2;

    camera.value.position.y = REST_Y + rise * options.bobVertical;
    camera.value.position.x = lane + Math.sin(stride) * options.bobLateral;
    // Counter-phase to the sway: you roll toward the leg you are standing on.
    camera.value.rotation.z = Math.sin(stride + Math.PI) * options.bobRoll;
  } else {
    camera.value.position.y = REST_Y;
    camera.value.position.x = lane;
    camera.value.rotation.z = 0;
  }
});
</script>

<template>
  <TresGroup />
</template>
