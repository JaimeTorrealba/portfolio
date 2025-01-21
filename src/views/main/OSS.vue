<script setup>
import { ref } from 'vue'
import ContributionTo from '@/components/oss/ContributionsTo.vue';
// import GithubStats from '@/components/oss/GithubStats.vue';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize()
const showCreated = ref(false)
</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section relative bloom-effect-layout scroll" v-show="!showCreated">
            <ContributionTo>
                <div class="flex flex-center">
                    <button v-show="width < 768" class="showButton" @click="showCreated = true">Github Graph</button>
                </div>
            </ContributionTo>
        </div>
        <!-- <div class="section relative bloom-effect-layout scroll" v-show="width > 768 || showCreated">
            <GithubStats>
                <div class="flex flex-center">
                    <button v-show="width < 768" class="showButton" @click="showCreated = false">Contributions</button>
                </div>
            </GithubStats>
        </div> -->
    </section>
</template>
<style scoped>
.full-height {
    height: 100%;
    border-radius: 16px;
    gap: 1rem;
}

.section {
    background-color: rgba(1, 1, 1, 0.75);
    border-radius: 16px;
    padding: 2rem 1rem;
    margin-right: 0.5rem;
    max-width: 1200px;
    @media screen and (max-width: 768px) {
        overflow-y: auto;
    }
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