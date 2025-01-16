<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { showText } from '@/utils/gsaps.js';
import BaseListItem from '../common/BaseListItem.vue';
import BaseTag from '@/components/common/BaseTag.vue';

const items = [
    {
        title: '3D con JavaScript - parte 1',
        href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-1-2k95',
        date: 2023,
        tags: ['3D', 'JS']
    },
    {
        title: '3D con JavaScript - parte 2',
        href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-2-1jj8',
        date: 2023,
        tags: ['3D', 'JS']
    },
    {
        title: '3D con JavaScript - parte 3',
        href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-3-56cj',
        date: 2023,
        tags: ['3D', 'JS']
    },
    {
        title: 'Tres.Js por una web con más 3D',
        href: 'https://dev.to/javascriptchile/tresjs-por-una-web-con-mas-3d-39d4',
        date: 2023,
        tags: ['3D', 'webdev']
    },
    {
        title: '¿Como es ser un mantenedor Open Source?',
        href: 'https://dev.to/jaimebboyjt/como-es-ser-un-mantenedor-open-source-4624',
        date: 2023,
        tags: ['OSS']

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
        <h2 ref="titleRef" class="h1 text-center Sentient ">Articulos en Español</h2>
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