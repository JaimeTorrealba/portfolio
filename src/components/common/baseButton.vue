<script setup>
defineProps({
    text: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: 'primary',
        validate: (value) => {
            return ['primary', 'secondary'].includes(value)
        }
    }
})
</script>
<template>
    <button :class="variant">{{ text }}</button>
</template>
<style  scoped>
.primary{
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    color: var(--white);
    box-shadow: 0 0 4px var(--white);
    background-color: var(--primary);
    background: radial-gradient(circle, rgb(131, 131, 131) 0%, rgba(210,69,78,1) 50%, rgba(0,0,0,1) 100%);}

</style>