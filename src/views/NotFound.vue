<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { useMainStore } from '@/stores'
import { showText, appear, drawIllustration } from '@/utils/gsaps.js'
import Tsathoggua from '@/assets/icons/TsathogguaIcon.vue'

const store = useMainStore()

onMounted(() => {
    const master = gsap.timeline()
    master.add(showText('#NotFoundTitle', { delay: 0 }))
    master.add(drawIllustration('#Tsathoggua'), '-=0.5')
    master.add(showText('#NotFoundText'), '<')
    appear('#NotFoundButton')
})

</script>
<template>
    <main class="overlay-bg" v-show="store.finishLoading">
        <section class="perfect-center">
            <div>
                <h1 class="h1-large bloom-effect-title h1 py-s title" id="NotFoundTitle">
                    404
                </h1>
                <h2 class="bloom-effect py-s" id="NotFoundText">This page doesn’t exist or is under construction</h2>
            </div>
            <Tsathoggua />
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