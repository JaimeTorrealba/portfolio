<script setup>
defineProps({
    tag: Object
})
</script>
<template>
    <code class="tag mx-s">{{ tag }}</code>
</template>
<style scoped>
.tag{
    background-color: #333333a3;
    border: 1px solid var(--white);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}
</style>