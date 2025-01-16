<script setup>
import BackButton from '../../components/common/BackButton.vue';

</script>
<template>
    <BackButton />
    <!-- 
    <h1 class="h2 text-center py-l Sentient-Bold"> Created by me: </h1>
    <BaseListItem v-for="item in libraries" :item="item" :key="item.title">
        <code class="px-s repo-text-size Sentient-Bold">
            {{ item.text }}:
        </code>
    </BaseListItem> -->
    <slot />
</template>