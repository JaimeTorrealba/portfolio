<script setup>
import BaseTag from './BaseTag.vue';
defineProps({
    item: Object
})
</script>
<template>
    <li class="link py-s Sentient pointer">
        <a class="flex flex-between flex-wrap " :href="item.href" target="_blank" rel="no-referrer">
            <div class="my-s">
                <slot /> {{ item.title }}
            </div>
            <div class="my-s">
                <BaseTag v-for="tag in item.tags" :tag="tag" :key="tag" />
            </div>
        </a>
    </li>
</template>
<style scoped>
.link {
    transition: all 0.3s;
}

.link:hover {
    background-color: #e4e4e42a;
}
</style>