<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { useMainStore } from '@/stores'
import { showText, appear } from '@/utils/gsaps.js'
import Tsathoggua from '@/assets/icons/TsathogguaIcon.vue'

const store = useMainStore()

onMounted(() => {
    const master = gsap.timeline()
    master.add(showText('#NotFoundTitle'))
    master.add(showText('#NotFoundText'), '-=0.75')
    master.add(appear('#TsathogguaID'), '<')
    master.add(appear('#NotFoundButton'), '-=1.5')
})

</script>
<template>
    <main class="overlay-bg" v-show="store.finishLoading">
        <section class="perfect-center">
            <div class="overflow-none">
                <h1 class="h1-large bloom-effect-title h1 py-s text-center" id="NotFoundTitle">
                    404
                </h1>
                <h2 class="bloom-effect py-s" id="NotFoundText">This page doesn’t exist or is under construction</h2>
            </div>
            <Tsathoggua class="opacity-none" />
            <div id="NotFoundButton" class="opacity-none">
                <RouterLink to="/main" class="outline-button ">
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
</style>