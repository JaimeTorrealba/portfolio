<script setup>
import { onMounted, ref } from "vue";
import SignatureJT from "@/assets/icons/SignatureJT.vue";
import YogSothoth from "@/assets/icons/Lovecraft/YogSothoth.vue";
import rough from "roughjs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const titleRef = ref(null);
const descriptionRef = ref(null);
const perfilRef = ref(null);
onMounted(() => {
  const rc = rough.canvas(document.getElementById("aboutMeCanvas"));
  rc.rectangle(2, 0, 210, 60, { stroke: "white" });
  document.fonts.ready.then(() => {
    const title = SplitText.create(titleRef.value, {
      type: "chars",
    });
    gsap.from(title.chars, {
      duration: 0.75,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out",
    });

    const firstText = SplitText.create(descriptionRef.value.children[1], {
      type: "lines",
    });
    const secondText = SplitText.create(descriptionRef.value.children[2], {
      type: "lines",
    });
    const lines = [firstText.lines, secondText.lines].flat();
    gsap.from(lines, {
      scrollTrigger: titleRef.value,
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      delay: 0.5,
    });
  });
  gsap.from(perfilRef.value, {
    scrollTrigger: perfilRef.value,
    duration: 0.5,
    delay: 0.5,
    opacity: 0,
    transformOrigin: "50% 50%",
    scale: 0.5,
    y: 50,
  });
});
</script>
<template>
  <section id="aboutme" class="min-h-screen">
    <div class="overflow-hidden p-2 is-relative">
      <h2 ref="titleRef" class="title is-flex is-align-items-center">
        <YogSothoth /> About Me
      </h2>
      <canvas id="aboutMeCanvas" class="canvas" width="300" height="200"></canvas>
    </div>
    <div ref="descriptionRef" class="p-4 is-flex is-flex-wrap-wrap is-justify-flex-start">
      <div class="is-flex is-justify-content-center w-full radial-gradient">
        <div class="blob my-4">
          <img
            ref="perfilRef"
            src="/img/Foto_Perfil.jpg"
            width="150"
            height="auto"
            alt="Perfil"
          />
        </div>
      </div>
      <div>
        <p class="has-text-light is-size-5 mb-3">
          I am a passionate creative developer with a strong background in creating
          interactive experiences on the web using 3D scenes, GPU image manipulations,
          micro-interactions, and well craft animations. <br />
          My expertise lies in Vue.js, JavaScript, CSS, Three.js and GSAP.
        </p>
        <p class="has-text-light is-size-5">
          In my free time, I enjoy contributing to open-source projects, teaching creating
          content and staying updated with the latest trends in web development. Out side
          software development, I love cooking, traveling, and spending time with my
          family.
        </p>
      </div>
    </div>
    <div class="is-flex max-w-signature mx-auto">
      <SignatureJT />
    </div>
  </section>
</template>
<style scoped>
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  @media screen and (max-width: 500px) {
    display: none;
  }
}

.max-w-signature {
  max-width: 1060px;
  justify-content: flex-end;
}

.blob {
  --size: 150px;
  --dur: 6s;
  width: var(--size);
  height: var(--size);
  position: relative;
  overflow: hidden; /* keeps image inside the blob */
  animation: blob var(--dur) ease-in-out infinite alternate,
    float calc(var(--dur) * 1.2) ease-in-out infinite;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
  @media screen and (max-width: 1536px) {
    --size: 240px;
  }
}

.blob img {
  object-fit: cover; /* image fills the shape */
  transform: scale(1.05); /* avoid edge gaps during morphs */
  width: 100%;
  height: 100%;
}

/* The magic: animate elliptical border-radius values */
@keyframes blob {
  0% {
    border-radius: 42% 58% 63% 37% / 45% 40% 60% 55%;
  }
  33% {
    border-radius: 57% 43% 35% 65% / 52% 62% 38% 48%;
  }
  66% {
    border-radius: 35% 65% 58% 42% / 40% 45% 55% 60%;
  }
  100% {
    border-radius: 62% 38% 40% 60% / 55% 35% 65% 45%;
  }
}

/* A subtle float so it feels organic */
@keyframes float {
  0% {
    transform: translateY(0) rotate(0.5deg);
  }
  50% {
    transform: translateY(-8px) rotate(-0.5deg);
  }
  100% {
    transform: translateY(0) rotate(0.5deg);
  }
}

/* Motion safety */
@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>
