<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import RRSS from '@/components/contact/RRSS.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import { showText } from '@/utils/gsaps.js'

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
  <main class="main-grid">
    <div>
      <h1 class="h1 bloom-effect" id="contactTitle">Contact me</h1>
      <!-- DIVIDER -->
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
.hr-contact{
  border: 1px solid #333;
}
</style>
