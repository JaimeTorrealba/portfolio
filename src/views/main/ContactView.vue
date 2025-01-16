<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import RRSS from '@/components/contact/RRSS.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import { showText } from '@/utils/gsaps.js'
import BackButton from '@/components/common/BackButton.vue'

const titleRef = ref(null)
onMounted(() => {
  const master = gsap.timeline()
  master.add(showText(titleRef.value))
  master.from('#form-id', {
    duration: 0.5,
    opacity: 0,
    scale: 0.5,
  }, '-=0.5')
})

</script>

<template>
  <section class="contact-section bloom-effect-layout relative flex flex-column flex-evenly">
    <BackButton />
    <div class="overflow-none">
      <h1 ref="titleRef" class="h1  text-center Sentient" id="contactTitle">Contact me</h1>
    </div>
    <div class="flex flex-center" id="form-id">
      <ContactForm  />
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
</style>
