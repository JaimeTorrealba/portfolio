<script setup>
import BackButton from '../../components/common/BackButton.vue';

const experiences = [
    {
        title: 'Happenence',
        description:'Personal blog for a writer, using Notion as CMS, and some WebGl effects.',
        date:'',
        img: '/img/projects/saludos_con_sentido.jpg',
        tags: ['Nuxt3', 'NotionAPI', 'Blog'],
        href: ''
    },
    {
        title: 'Voltri',
        description:'Personal site for an electrical company in Chile',
        date:'',
        img: '/img/projects/saludos_con_sentido.jpg',
        tags: ['Nuxt3'],
        href: ''
    },
    {
        title: 'Saludos con sentido',
        description:'Platform for sending personalized cards, digital and physical, to people in hospitals. by Coaniquem',
        date:'',
        img: '/img/projects/saludos_con_sentido.jpg',
        tags: ['Vue.js', 'Vuetify', 'Laravel'],
        href: ''
    },
    {
        title: 'Hazte socio',
        description:'Platform to become a member of Coaniquem, with a payment gateway and a dashboard for the user.',
        date:'',
        img: '/img/projects/supervoluntarios.jpg',
        tags: ['Vue.js', 'Ruby on Rails'],
        href: ''
    },
    {
        title: 'Colecta 2021',
        description:'Platform for the annual fundraising campaign of Coaniquem, with a payment gateway and a dashboard for the user.',
        date:'',
        img: '/img/projects/colecta.jpg',
        tags: ['Vue.js', 'Ruby on Rails'],
        href: ''
    },
]

</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section relative bloom-effect-layout">
            <BackButton />
            <h1 class="h1 bloom-effect text-center py-l" id="contactTitle">Projects</h1>
            <!-- <BaseListItemImg v-for="experience in experiences" :item="experience" :key="experience.title" /> -->
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
    padding: 2rem;
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