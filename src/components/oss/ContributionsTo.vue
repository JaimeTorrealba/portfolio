<script setup>
import BaseListItem from '@/components/common/BaseListItem.vue';
import BackButton from '../../components/common/BackButton.vue';

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
    <BackButton />
    <h1 class="h2 text-center py-l Sentient-Bold"> Contributions to: </h1>
    <BaseListItem v-for="item in contributions" :item="item" :key="item.title">
        <code class="px-s repo-text-size Sentient-Bold">
            {{ item.text }}:
        </code>
    </BaseListItem>
    <slot />
</template>