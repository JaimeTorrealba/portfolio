<script setup>
import BaseListItem from '@/components/common/BaseListItem.vue';
import BackButton from '../../components/common/BackButton.vue';

const libraries = [
    { title: 'Creative-lab', href: 'https://github.com/JaimeTorrealba/creative-lab' },
    { title: 'Tres-path-tracing', href: 'https://github.com/Tresjs/path-tracing' },
    { title: 'Tres FPS Controls', href: 'https://github.com/JaimeTorrealba/tres-fps-controls' },
    { title: 'Portfolio', href: 'https://github.com/JaimeTorrealba/portfolio' },
    { title: 'vScale', href: 'https://github.com/JaimeTorrealba/vScale' },
    { title: 'Path selector (Achieved)', href: 'https://github.com/JaimeTorrealba/path-selector' },
]

const contributions = [
    { title: 'ThreeJs', href: 'https://github.com/mrdoob/three.js' },
    { title: 'vuexyz', href: 'https://github.com/vuexyz/vuexyz' },
    { title: 'vue-telescope-analyzer', href: 'https://github.com/nuxtlabs/vue-telescope-analyzer' },
    { title: 'ThreeJs', href: 'https://github.com/FarazzShaikh/THREE-CustomShaderMaterial' },
    { title: 'THREE-CustomShaderMateria', href: 'https://github.com/RenaudRohlinger/stats-gl' },
    { title: 'awesome-vue', href: 'https://github.com/vuejs/awesome-vue' },
    { title: 'awesome-threejs', href: 'https://github.com/AxiomeCG/awesome-threejs' },
]
</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section relative bloom-effect-layout">
            <BackButton />
            <h1 class="h1 bloom-effect text-center Sentient" id="contactTitle">Open source</h1>
            <h3 class="h3 py"> Contributions to: </h3>
            <BaseListItem v-for="item in contributions" :item="item" :key="item.title">
                <code class="px-s cascadian">
                    Hola
                </code>
            </BaseListItem>
            <h2 class="h3 py"> My Libraries: </h2>
            <BaseListItem v-for="item in libraries" :item="item" :key="item.title">
                <code class="px-s cascadian">
                    Hola
                </code>
            </BaseListItem>


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