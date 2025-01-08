<script setup>
import BaseListItem from '../common/BaseListItem.vue';

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
</script>
<template>
    <h1 class="h2 text-center py-l Sentient-Bold">Articles English</h1>
    <ul class="max-width">
        <BaseListItem v-for="item in items" :item="item" :key="item.title">
            <code class="px-s cascadian">
                {{ item.date }} -
            </code>
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