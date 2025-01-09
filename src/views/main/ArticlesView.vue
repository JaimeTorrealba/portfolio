<script setup>
import { ref } from 'vue'
import EnArticles from '@/components/articles/EnArticles.vue'
import EsArticles from '@/components/articles/EsArticles.vue'
import BackButton from '../../components/common/BackButton.vue';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize()
const showEs = ref(false)
</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section bloom-effect-layout relative" v-show="!showEs">
            <BackButton />
            <EnArticles>
                <div class="flex flex-center">
                    <button v-show="width < 768" class="showButton" @click="showEs = true">See articles in
                        Spanish</button>
                </div>
            </EnArticles>
        </div>
        <div class="section relative bloom-effect-layout" v-show="width > 768 || showEs">
            <BackButton />
            <EsArticles>
                <div class="flex flex-center">
                    <button v-show="width < 768" class="showButton" @click="showEs = false">Ver posts en Ingles</button>
                </div>
            </EsArticles>
        </div>
    </section>
</template>
<style scoped>
.full-height {
    height: 100%;
    border-radius: 16px;
}

.section {
    background-color: rgba(1, 1, 1, 0.75);
    border-radius: 16px;
    padding: 2rem 1rem;
    margin-right: 0.5rem;
    overflow-y: auto;
    max-width: 1200px;
}

.showButton {
    color: var(--white);
    background-color: var(--black);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    margin: 1rem;
    cursor: pointer;
}
</style>