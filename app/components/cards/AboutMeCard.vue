<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { showText } from "@/utils/gsaps.js";
import { prefersReducedMotion } from "@/utils/motion.js";
import RRSS from "@/components/common/RRSS.vue";
import SignatureJT from "@/assets/icons/SignatureJT.vue";
import CardFrame from "@/components/cards/CardFrame.vue";
import { person } from "#shared/profile";
gsap.registerPlugin(SplitText);

const emit = defineEmits(["close"]);

const titleRef = ref(null);
const subTitleRef = ref(null);
const firstTextRef = ref(null);
const secondTextRef = ref(null);
let firstTextSplit = null;
let secondTextSplit = null;

// Every tween and SplitText the card starts goes in here, so closing the card mid-intro
// stops them instead of leaving them running on detached nodes.
const animationContext = gsap.context(() => {});

const playAnimation = async () => {
  await nextTick();
  firstTextSplit?.revert();
  secondTextSplit?.revert();
  animationContext.add(() => {
    const master = gsap.timeline();
    master.add(showText(titleRef.value));
    master.add(showText(subTitleRef.value), "-=0.5");
    firstTextSplit = SplitText.create(firstTextRef.value, {
      type: "lines",
    });
    secondTextSplit = SplitText.create(secondTextRef.value, {
      type: "lines",
    });
    const lines = [firstTextSplit.lines, secondTextSplit.lines].flat();
    if (prefersReducedMotion()) {
      // Reverting restores the original markup, so the copy reads normally.
      firstTextSplit.revert();
      secondTextSplit.revert();
      firstTextSplit = null;
      secondTextSplit = null;
      return;
    }
    gsap.from(lines, {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.75,
      delay: 0.25,
      ease: "power2.out",
      onComplete: () => {
        firstTextSplit?.revert();
        secondTextSplit?.revert();
        firstTextSplit = null;
        secondTextSplit = null;
      },
    });
  });
};

onMounted(playAnimation);
// Kill, not revert: the card is still fading out when this runs.
onBeforeUnmount(() => animationContext.kill());
</script>
<template>
  <section class="container" role="dialog" aria-modal="true" aria-labelledby="about-card-title">
    <CardFrame class="card-panel" :seed="7" @close="emit('close')">
      <div class="glass-content">
        <div class="content-glass">
          <div class="overflow-hidden">
            <h2 id="about-card-title" ref="titleRef" class="is-size-1">{{ person.name }}</h2>
            <p ref="subTitleRef" class="is-size-2">{{ person.jobTitle }}</p>
          </div>
          <p ref="firstTextRef" class="text-container">{{ person.bio[0] }}</p>
          <p ref="secondTextRef">{{ person.bio[1] }}</p>
        </div>
        <span class="signature">
          <SignatureJT />
        </span>
        <RRSS class="rrss" />
      </div>
    </CardFrame>
  </section>
</template>
<style scoped>
.glass-content {
  display: grid;
  grid-template-areas:
    "content"
    "rrss";
  grid-template-columns: 1fr;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 1rem;
  overflow: visible;
}

.rrss {
  grid-area: rrss;
  width: 100%;
}

.content-glass {
  grid-area: content;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 1rem;
  width: 100%;
  height: 100%;
}

.text-container {
  margin-top: 1rem;
  position: relative;
}
.signature {
  position: absolute;
  bottom: -10%;
  right: -5%;
  @media screen and (max-width: 1280px) {
    display: none;
  }
}
</style>
<style scoped src="./CardLayout.css"></style>
