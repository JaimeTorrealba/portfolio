<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import RRSS from '@/components/contact/RRSS.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import { useCustomRouterFn } from "@/composables/routers.js";
import { showText } from '@/utils/gsaps.js'
import CloseIcon from '@/assets/icons/CloseIcon.vue'

const { goToMain } = useCustomRouterFn()

onMounted(() => {
  const master = gsap.timeline()
  master.add(showText('#contactTitle', { delay: 0 }))
  master.from('#form-id', {
    duration: 1.5,
    opacity: 0,
  })
})

</script>

<template>
  <section class="contact-section bloom-effect-layout relative flex flex-column flex-evenly">
    <button class="button-back pointer" @click="goToMain()">
      <CloseIcon />
    </button>
    <div>
      <h1 class="h1 bloom-effect" id="contactTitle">Contact me</h1>
    </div>
    <div class="flex flex-center">
      <ContactForm id="form-id" />
    </div>
    <RRSS />
  </section>
</template>
<style scoped>
.contact-section {
  background-color: rgba(1, 1, 1, 0.55);
  height: 100%;
  border-radius: 4px;
  padding: 2rem 1rem;
  margin-right: 0.5rem;
}

.negative-margin {
  margin-bottom: -2rem;
}

.button-back {
  position: absolute;
  top: 2%;
  right: 2.5%;
  border-radius: 4px;
}
</style>
