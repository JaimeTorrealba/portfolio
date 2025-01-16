<script setup>
defineProps({
    tag: Object
})
</script>
<template>
        <code class="tag cascadian">{{ tag }}</code>

</template>
<style scoped>
.tag{
    background-color: #333333a3;
    border: 1px solid var(--white);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    margin-right: 0.25rem;
    font-size: 12px;
}
</style>