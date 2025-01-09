<script setup>
import BackButton from '../../components/common/BackButton.vue';

</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section relative bloom-effect-layout">
            <BackButton />
            <h1 class="h1 bloom-effect text-center" id="contactTitle">Projects</h1>
        </div>
    </section>
</template>
<style scoped>
.full-height {
    height: 100%;
    border-radius: 16px;
}

.section {
    background-color: rgba(1, 1, 1, 0.75);
    border-radius: 16px;
    padding: 2rem 1rem;
    margin-right: 0.5rem;
    overflow-y: auto;
    max-width: 1200px;
}

.showButton {
    color: var(--white);
    background-color: var(--black);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    margin: 1rem;
    cursor: pointer;
}
</style>