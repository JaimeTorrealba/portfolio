<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { gsap } from "gsap";
import SignatureJT from '@/assets/icons/SignatureJT.vue'
import { appear } from "@/utils/gsaps";
// COMPONENTS
import Values from './tabs/TheValues.vue'
import Articles from './tabs/TheArticles.vue'
import OSS from './tabs/TheOSS.vue'
import Links from './tabs/TheLinks.vue'
import Languages from './tabs/TheLanguages.vue'
import Hobbies from './tabs/TheHobbies.vue'

const imgSize = 48

const current = ref('Values')
const { width } = useWindowSize()
const isDesktop = computed(() => width.value > 1024)

const handleComponents = (component) => {
    current.value = component
}

const aboutComponents = {
    Values,
    Articles,
    OSS,
    Languages,
    Links,
    Hobbies,
}

onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#aboutButtons *', { delay: 0, stagger: 0.075, y:0 }))
    if(isDesktop.value){
        master.add(appear('#imgAbout', { delay: 0, stagger: 0.1 }), '<')
    }
})
</script>
<template>
    <div class="flex flex-center py-l">
        <p class="text-center principal-about-text" id="aboutText">
            I’m very pasionate about good quality coding, beautiful desings and help people. I formed myself
            as a front-end developer, but I discover the beautiful of creating amazing experiences for final
            users.
        </p>
    </div>
    <div class="twoColumns">
        <section class="flex flex-center column1">
            <Transition name="fade" mode="out-in">
                <component :is="aboutComponents[current]" />
            </Transition>
        </section>
        <section class="flex flex-column py-l column2">
            <div class="py-s sticky">
                <nav class="flex flex-evenly" id="aboutButtons">
                    <button class="flex flex-column flex-center-column button-articles"
                        :class="current === 'Values' ? 'active' : ''" @click="handleComponents('Values')">
                        <span class="pa-s">Values</span>
                        <img src="/img/Values.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        :class="current === 'Articles' ? 'active' : ''" @click="handleComponents('Articles')">
                        <span class="pa-s">Articles</span>
                        <img src="/img/Articles.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        :class="current === 'OSS' ? 'active' : ''" @click="handleComponents('OSS')">
                        <span class="pa-s">OSS</span>
                        <img src="/img/Open_Sources.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        :class="current === 'Languages' ? 'active' : ''" @click="handleComponents('Languages')">
                        <span class="pa-s">Languages</span>
                        <img src="/img/Languages.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        :class="current === 'Links' ? 'active' : ''" @click="handleComponents('Links')">
                        <span class="pa-s">Links</span>
                        <img src="/img/Links.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        :class="current === 'Hobbies' ? 'active' : ''" @click="handleComponents('Hobbies')">
                        <span class="pa-s">Hobbies</span>
                        <img src="/img/Hobbies.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                </nav>
            </div>
            <div class="sticky-image">
                <div class="py-s flex flex-center relative" v-if="isDesktop">
                    <img src="/img/Foto_Perfil.jpg" width="50%" class="img-perfil" id="imgAbout" />
                    <div class="icon-position">
                        <SignatureJT />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<style scoped>
.principal-about-text {
    font-size: 1.25rem;
    line-height: 1.5;
}
.twoColumns {
    display: grid;
    grid-template-columns: 1fr 0.75fr;
    gap: 1rem;

    @media screen and (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
}

.column1 {
    order: -1;
}

.column2 {
    order: 1;
}

@media screen and (max-width: 1024px) {
    .column1 {
        order: 1;
    }

    .column2 {
        order: -1;
    }

    .sticky-image {
        position: static;
    }

    .sticky {
        position: static !important;
    }
}

.button-articles {
    cursor: pointer;
    color: var(--white);
    font-family: inherit;
    font-size: 1rem;
    transition: transform 0.3s;
}

.button-articles:hover {
    transform: scale(1.1) !important ;
}

.img-perfil {
    border-radius: 0.5rem;
    min-width: 300px;
    min-height: 250px;
    max-width: 600px;
}

.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}

.icon-position {
    position: absolute;
    bottom: -10%;
    right: 20%;

    @media screen and (max-width: 1200px) {
        right: 10%;
    }
}

.sticky {
    top: 0;
    position: sticky;
}

.sticky-image {
    top: 100px;
    position: sticky;
}

.active {
    color: var(--gold);
    transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>