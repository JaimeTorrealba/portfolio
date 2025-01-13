<script setup>
import BaseListItem from '@/components/common/BaseListItem.vue';
import BackButton from '../../components/common/BackButton.vue';

const libraries = [
    { text: 'Tres FPS Controls', title: 'First person shooter controls for Tres.js', href: 'https://github.com/JaimeTorrealba/tres-fps-controls' },
    { text: 'Tres-path-tracing', title: 'Path-tracing render to construct declarative scenes', href: 'https://github.com/Tresjs/path-tracing', tags: ['Private'] },
]
</script>
<template>
    <BackButton />
    <h1 class="h2 text-center py-l Sentient-Bold"> Created by me: </h1>
    <BaseListItem v-for="item in libraries" :item="item" :key="item.title">
        <code class="px-s repo-text-size Sentient-Bold">
            {{ item.text }}:
        </code>
    </BaseListItem>
    <slot />
</template>