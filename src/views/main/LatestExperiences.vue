<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { showText } from '@/utils/gsaps.js';
import BackButton from '../../components/common/BackButton.vue';
import BaseTag from '../../components/common/BaseTag.vue';

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

const itemsRef = ref(null)
const titleRef = ref(null)
onMounted(() => {
    showText(titleRef.value)
    gsap.from(itemsRef.value, {
        duration: 0.25,
        filter: 'blur(10px)',
        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: 'power3.in',
        delay: 0.5
    });
})
</script>
<template>
    <section class="flex flex-column flex-evenly full-height relative scroll bloom-effect-layout">
        <div class="section relative ">
            <BackButton />
            <div class="overflow-none">
                <h1 class="h1 text-center Sentient py-l" ref="titleRef">Latest Experience</h1>
            </div>
            <div class="link py-s Sentient pointer" v-for="item in experiences" :item="experience" :key="item.title" >
                <a ref="itemsRef" class="flex flex-between flex-wrap " :href="item.href" target="_blank" rel="no-referrer">
                    <div class="my-s grid-container">
                        <div class="img-wrapper flex flex-center-column flex-center">
                            <img :src="item.img" class="w-full" width="200" />
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

.grid-container {
    display: grid;
    grid-template-columns: 10% 1fr;
    gap: 1rem;
    place-items: center;

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.helper {
    font-size: 0.75rem;
}

.img-wrapper {
    margin-right: 1rem;
    height: 100%;
    width: 100%;
    @media screen and (max-width: 768px) {
        height: 50%;
        width: 50%;
    }
}

.link {
    transition: all 0.3s;
}

.link:hover {
    background-color: #e4e4e42a;
}
</style>