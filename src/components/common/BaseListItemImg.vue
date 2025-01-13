<script setup>
import BaseTag from './BaseTag.vue';
defineProps({
    item: Object
})
</script>
<template>
    <div class="link py-s Sentient pointer">
        <a class="flex flex-between flex-wrap " :href="item.href" target="_blank" rel="no-referrer">
            <div class="my-s grid-container">
                <div class="img-wrapper flex flex-center-column flex-center">
                    <img :src="item.img" class="img" width="200" />
                </div>
                <div class="px-s">
                    <p class="Sentient-Bold h4 py-s">{{ item.title }} <span
                            class="px cascadian helper">{{ item.date }}</span> </p>
                    <p>{{ item.description }}</p>
                    <div class="my">
                        <BaseTag v-for="tag in item.tags" :tag="tag" :key="tag" />
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>
<style scoped>
.grid-container{
    display: grid;
    grid-template-columns: 10% 1fr;
    gap: 1rem;
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}
.helper {
    font-size: 0.75rem;
}

.img{
    width: 100%;
}

.img-wrapper{
    margin-right: 1rem;
    height: 100%;
    width: 100%;

}

.link {
    transition: all 0.3s;
}

.link:hover {
    background-color: #e4e4e42a;
}
</style>