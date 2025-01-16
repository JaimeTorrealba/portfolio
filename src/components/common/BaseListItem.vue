<script setup>
defineProps({
    href: String
})
</script>
<template>
    <li class="link py-s Sentient pointer">
        <a class="flex flex-between flex-wrap " :href="href" target="_blank" rel="no-referrer">
                <slot />
        </a>
    </li>
</template>
<style scoped>
.link {
    transition: all 0.3s;
    border-radius: 0.5rem;
}

.link:hover {
    background-color: #e4e4e42a;
}
</style>