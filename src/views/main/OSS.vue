<script setup>
import BaseListItem from '@/components/common/BaseListItem.vue';
import BackButton from '../../components/common/BackButton.vue';

const libraries = [
    { text: 'Tres FPS Controls', title: 'First person shooter controls for Tres.js', href: 'https://github.com/JaimeTorrealba/tres-fps-controls' },
    { text: 'Tres-path-tracing', title: 'Path-tracing render to construct declarative scenes', href: 'https://github.com/Tresjs/path-tracing', tags: ['Private'] },
]

const contributions = [
    { text: 'Tres.js', title: 'Create awesome 3D experiences with the framework you love.', href: 'https://github.com/mrdoob/three.js', tags: ['Ex-Maintainer'] },
    { text: 'ThreeJs', title: 'JavaScript 3D Library.', href: 'https://github.com/mrdoob/three.js' },
    { text: 'Vuexyz', title: 'Creative coding composables for Vue 3.', href: 'https://github.com/vuexyz/vuexyz' },
    { text: 'Vue-telescope-analyzer', title: 'Detect Vue technologies running on a website ✨', href: 'https://github.com/nuxtlabs/vue-telescope-analyzer' },
    { text: 'CustomShaderMaterial', title: '🧩 Extend Three.js standard materials with your own shaders!', href: 'https://github.com/FarazzShaikh/THREE-CustomShaderMaterial' },
    { text: 'Stats-gl', title: 'WebGL/WebGPU Performance Monitor tool.', href: 'https://github.com/RenaudRohlinger/stats-gl' },
    { text: 'Awesome-vue', title: '🎉 A curated list of awesome things related to Vue.js', href: 'https://github.com/vuejs/awesome-vue' },
    { text: 'Awesome-threejs', title: '3️⃣ A curated list of awesome ThreeJS resources', href: 'https://github.com/AxiomeCG/awesome-threejs' },
]
</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section relative bloom-effect-layout">
            <BackButton />
            <h1 class="h1 bloom-effect text-center Sentient" id="contactTitle">Open source</h1>
            <h3 class="h3 py"> Contributions to: </h3>
            <BaseListItem v-for="item in contributions" :item="item" :key="item.title">
                <code class="px-s Sentient-Bold">
                    {{ item.text }}:
                    </code>
            </BaseListItem>
            <h2 class="h3 py"> Created by me: </h2>
            <BaseListItem v-for="item in libraries" :item="item" :key="item.title">
                <code class="px-s Sentient-Bold">
                    {{ item.text }}:
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