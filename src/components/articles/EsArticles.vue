<script setup>
import BaseListItem from '../common/BaseListItem.vue';

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
</script>
<template>
    <h1 class="h2 text-center py-l cascadian">Articulos en Español</h1>
    <ul class="max-width">
        <BaseListItem v-for="item in items" :item="item" :key="item.title">
            <code class="px-s">
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