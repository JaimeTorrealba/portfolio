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
    master.add(showLongText('#aboutText', { stagger: 0.025, delay: 0 }), '<')
    //master.add(drawIllustration('#divider'), '<')
})
</script>
<template>
    <main class="main-grid">
        <div>
            <h1 class="h1 bloom-effect" id="aboutTitle">
                About me</h1>
            <div class="flex flex-center">
                <DividerSvg />
            </div>
        </div>
        <div class="custom-padding-about">
            <div class="about-container bloom-effect-layout flex flex-column">
                <button class="button-back pointer" @click="router.back()">
                    <CloseIcon />
                </button>
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


.about-container {
    --sb-track-color: #232E33;
    --sb-thumb-color: #e4e4e4;
    --sb-size: 14px;
}

.about-container::-webkit-scrollbar {
    width: var(--sb-size);
}

.about-container::-webkit-scrollbar-track {
    background: var(--sb-track-color);
    border-radius: 3px;
}

.about-container::-webkit-scrollbar-thumb {
    background: var(--sb-thumb-color);
    border-radius: 3px;
}

@supports not selector(::-webkit-scrollbar) {
    .about-container {
        scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
    }
}
</style>