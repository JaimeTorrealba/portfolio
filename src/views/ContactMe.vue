<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import RRSS from '@/components/contact/RRSS.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import DividerSvg from '@/assets/icons/DividerSvg.vue'
import { showText, drawIllustration } from '@/utils/gsaps.js'

onMounted(() => {
  const master = gsap.timeline()
  master.add(showText('#contactTitle', { delay: 0 }))
  master.from('#form-id', {
    duration: 1.5,
    opacity: 0,
  })
  master.add(drawIllustration('#divider'), '<')
})

</script>

<template>
  <main class="main-grid">
    <div>
      <h1 class="h1 bloom-effect" id="contactTitle">Contact me</h1>
      <div class="flex flex-center negative-margin">
        <DividerSvg />
      </div>
    </div>
    <ContactForm id="form-id" />
    <RRSS />
  </main>
</template>
<style scoped>
.main-grid {
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100vw;
}
.negative-margin{
  margin-bottom: -2rem;
}
</style>
