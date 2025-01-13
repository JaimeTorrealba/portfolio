<script setup>
import BackButton from '../../components/common/BackButton.vue';
import BaseListItemImg from '../../components/common/BaseListItemImg.vue';

const experiences = [
    {
        title: 'Push security, Frontend Developer',
        description: `Push Security is a cybersecurity company browser based focus on ITDR (Identity threat detect and respond)`,
        date: "11/2024 - Current",
        img: '/img/experiences/PushLogo.svg',
        tags: ['Vue', 'CMS', 'Creative-code', 'UK'],
        href: 'https://pushsecurity.com/'
    },
    {
        title: 'Sky Airline, Frontend Developer',
        description: `SKY is one of the largest budget airlines in Latin America`,
        date: "09/2022 - 04/2024",
        img: '/img/experiences/SkyLogo.svg',
        tags: ['Vue', 'Micro-fronts', 'Airline', 'Chile'],
        href: 'https://www.skyairline.com/'
    },
    {
        title: 'Lemu, Frontend Developer',
        description: `Lemu is a startup focused on conservation parks and wildlife.`,
        date: "03/2022 - 09/2022",
        img: '/img/experiences/LemuLogo.svg',
        tags: ['Flutter', 'Firebase', 'Map-box', 'Chile'],
        href: 'https://le.mu/'
    },
    {
        title: 'Ripley Tech, Full stack developer',
        description: `One of the biggest retail companies in Chile.`,
        date: "07/2019 - 03/2022",
        img: '/img/experiences/RipleyLogo.svg',
        tags: ['React.js', 'Node.js', 'MongoDB', 'Chile'],
        href: 'https://simple.ripley.cl/'
    },
    {
        title: 'Coaniquem, Frontend Developer',
        description: `Coaniquem is an NGO that helps children recovering from severe burns for free in Chile.`,
        date: " 02/2017 - 07/2019",
        img: '/img/experiences/CoaniquemLogo.svg',
        tags: ['Vue', 'Freelance', 'Campaigns', 'Chile'],
        href: 'https://coaniquem.cl/'
    }
]

</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative">
        <div class="section relative bloom-effect-layout">
            <BackButton />
            <h1 class="h1 bloom-effect text-center py-l" id="contactTitle">Latest Experience</h1>
            <BaseListItemImg v-for="experience in experiences" :item="experience" :key="experience.title" />
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