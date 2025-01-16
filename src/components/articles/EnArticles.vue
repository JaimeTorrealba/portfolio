<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { showText } from '@/utils/gsaps.js';
import BaseListItem from '../common/BaseListItem.vue';
import BaseTag from '@/components/common/BaseTag.vue';

const items = [
    {
        title: 'Multi-cameras with Tres.js',
        href: 'https://medium.com/stackademic/multi-cameras-with-tresjs-26a54d06878e',
        date: 2024,
        tags: ['3D', 'three.js', 'JS']
    },
    {
        title: 'How to create an infinite tube with Tres.js',
        href: 'https://medium.com/stackademic/how-to-create-an-infinite-tube-with-tresjs-e9ff4fc76e86',
        date: 2024,
        tags: ['3D', 'three.js', 'JS']
    },
    {
        title: '3D Pixel art on the web',
        href: 'https://medium.com/@Jaimebboyjt/3d-pixel-art-on-the-web-f70fbf68fb4f',
        date: 2024,
        tags: ['3D', 'CAD', 'crocotile3d']
    },
    {
        title: 'Transition component using Vue.Js and Tres.Js',
        href: 'https://medium.com/@Jaimebboyjt/transition-threejs-component-using-vuejs-and-tresjs-d1119cb8ef6c',
        date: 2023,
        tags: ['vue.js', 'tres.js']
    },
    {
        title: 'How to use instanceMesh with Tres.js',
        href: 'https://medium.com/@Jaimebboyjt/how-to-use-instancemesh-with-tresjs-fae8e3b48dcc',
        date: 2023,
        tags: ['3D', 'GLSL']

    },
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
    <div class="overflow-none">
        <h1 ref="titleRef" class="h1 text-center Sentient ">Articles English</h1>
    </div>
    <ul class="max-width">
        <BaseListItem v-for="item in items" :href="item.href" :key="item.title">
            <div ref="itemsRef" class="flex w-full flex-between flex-wrap py-s">
                <div class="my-s">
                    <code class="px-s cascadian">
                        {{ item.date }} -
                    </code>
                    <span class="Sentient">
                        {{ item.title }}
                    </span>
                </div>
                <div class="my-s">
                    <BaseTag v-for="tag in item.tags" :tag="tag" :key="tag" />
                </div>
            </div>

        </BaseListItem>
    </ul>
    <slot />
</template>

<style scoped>
.max-width {
    max-width: 800px;
    margin: 0 auto;
}
</style>