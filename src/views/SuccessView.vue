<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores'
import { showText, appear, drawIllustration } from '@/utils/gsaps.js'
import CthughaIcon from '@/assets/icons/CthughaIcon.vue'

const store = useMainStore()
const route = useRoute()

const name = route.params.name

onMounted(() => {
    const master = gsap.timeline()
    master.add(showText('#NotFoundTitle', { delay: 0 }))
    master.add(drawIllustration('#Cthulga'), '-=0.5')
    master.add(showText('#successText'), '<')
    appear('#NotFoundButton')
})

</script>
<template>
    <main class="overlay-bg" v-show="store.finishLoading">
        <section class="perfect-center">
            <div>
                <h1 class="h1-large bloom-effect-title h1 py-s title" id="NotFoundTitle">
                    Thanks, {{ name }}
                </h1>
                <h2 class="bloom-effect py-s" id="successText">Your message have been send, I’ll contact you as soon as possible</h2>
            </div>
            <CthughaIcon />
            <div id="NotFoundButton">
                <RouterLink to="/" class="outline-button">
                    Go back home
                </RouterLink>
            </div>
        </section>
    </main>
</template>
<style scoped>
.perfect-center {
    display: grid;
    place-items: center;
    min-height: 100vh;
    min-width: 100vw;
    background-color: transparent;
}
.title > .line {
    padding: 2rem;
}
</style>