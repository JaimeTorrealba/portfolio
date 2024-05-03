<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { useRouter } from 'vue-router'
import TheContent from '@/components/about/TheContent.vue'
import CloseIcon from '@/assets/icons/CloseIcon.vue'
import DividerSvg from '@/assets/icons/DividerSvg.vue'
import { showText, drawIllustration, showLongText } from '@/utils/gsaps.js'

const router = useRouter()



onMounted(() => {
    const master = gsap.timeline()
    master.add(showText('#aboutTitle', { delay: 0 }))
    master.add(showLongText('#aboutText', { stagger: 0.05, delay: 0 }), '<')
    master.add(drawIllustration('#divider'), '<')
})
</script>
<template>
    <main class="main-grid">
        <div>
            <h1 class="h1 bloom-effect" id="aboutTitle">About me</h1>
            <div class="flex flex-center">
                <DividerSvg />
            </div>
        </div>
        <div class="custom-padding-about">
            <div class="about-container bloom-effect-layout flex flex-column">
                <button class="button-back pointer" @click="router.back()">
                    <CloseIcon />
                </button>
                <div class="flex flex-center py-l">
                    <p class="text-center principal-about-text" id="aboutText">
                        I’m very pasionate about good quality coding, beautiful desings and help people. I formed myself
                        as a front-end developer, but I discover the beautiful of creating amazing experiences for final
                        users.
                    </p>
                </div>
                    <TheContent />
            </div>
        </div>
    </main>
</template>
<style scoped>
.main-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 20% 80%;
    height: 100vh;
    width: 100vw;
}

.button-back {
    position: absolute;
    top: 2%;
    right: 1%;
    border-radius: 4px;
}

.custom-padding-about {
    padding: 0 3rem 2rem;
}

.about-container {
    position: relative;
    height: 100%;
    width: 100%;
    outline: 1px solid #f7f7f7;
    background-color: rgba(1, 1, 1, 0.75);
    border-radius: 2px;
    padding: 2rem;
    overflow-y: auto;
}
.principal-about-text{
    font-size: 1.25rem;
    line-height: 1.5;
}
</style>