<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import BaseListItem from '@/components/common/BaseListItem.vue';
import BaseTag from '@/components/common/BaseTag.vue';
import BackButton from '../../components/common/BackButton.vue';
import { showText } from '@/utils/gsaps.js';

const contributions = [
    { title: 'Tres.js', description: 'Create awesome 3D experiences with the framework you love.', href: 'https://github.com/mrdoob/three.js', tags: ['Ex-Maintainer'] },
    { title: 'ThreeJs', description: 'JavaScript 3D Library.', href: 'https://github.com/mrdoob/three.js' },
    { title: 'Vuexyz', description: 'Creative coding composables for Vue 3.', href: 'https://github.com/vuexyz/vuexyz' },
    { title: 'Vue-telescope-analyzer', description: 'Detect Vue technologies running on a website ✨', href: 'https://github.com/nuxtlabs/vue-telescope-analyzer' },
    { title: 'CustomShaderMaterial', description: '🧩 Extend Three.js standard materials with your own shaders!', href: 'https://github.com/FarazzShaikh/THREE-CustomShaderMaterial' },
    { title: 'Stats-gl', description: 'WebGL/WebGPU Performance Monitor tool.', href: 'https://github.com/RenaudRohlinger/stats-gl' },
    { title: 'Awesome-vue', description: '🎉 A curated list of awesome things related to Vue.js', href: 'https://github.com/vuejs/awesome-vue' },
    { title: 'Awesome-threejs', description: '3️⃣ A curated list of awesome ThreeJS resources', href: 'https://github.com/AxiomeCG/awesome-threejs' },
    { title: 'Tres FPS Controls', description: 'First person shooter controls for Tres.js', href: 'https://github.com/JaimeTorrealba/tres-fps-controls', tags: ['Created by me'] },
    { title: 'Tres-path-tracing', description: 'Path-tracing render to construct declarative scenes', href: 'https://github.com/Tresjs/path-tracing', tags: ['Private', 'Beta', 'Created by me'] }
]

const itemsRef = ref(null)
const titleRef = ref(null)
onMounted(() => {
    showText(titleRef.value)
    gsap.from(itemsRef.value, {
        duration: 0.25,
        filter: 'blur(10px)',
        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: 'power3.in',
        delay: 0.5
    });
})
</script>
<template>
    <BackButton />
    <div class="overflow-none">
        <h1 class="h1 text-center Sentient py-l" ref="titleRef"> Contributions to: </h1>
    </div>
    <ol>
        <BaseListItem v-for="item in contributions" :href="item.href" :key="item.title">
            <div ref="itemsRef" class="flex flex-column flex-between Sentient w-full">
                <p class="Sentient-Bold h4">
                    {{ item.title }}
                </p>
                <div class="flex flex-between flex-wrap">
                    <p>
                        {{ item.description }}
                    </p>
                    <div>
                        <BaseTag v-for="tag in item.tags" :tag="tag" :key="tag" />
                    </div>
                </div>
            </div>
        </BaseListItem>
    </ol>
    <slot />
</template>