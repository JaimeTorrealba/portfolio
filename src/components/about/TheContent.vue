<script setup>
import { ref } from 'vue'
import SignatureJT from '@/assets/icons/SignatureJT.vue'
import Values from './tabs/TheValues.vue'

const imgSize = 48

const current = ref('Values')

const handleComponents = (component) => {
    current.value = component
}

const aboutComponents = {
    Values,
    // Articles: 'Articles',
    // OSS: 'OSS',
    // Languages: 'Languages',
    // Links: 'Links',
    // Hobbies: 'Hobbies',
}
</script>
<template>
    <div class="twoColumns">
        <section class="flex flex-center ">
            <Transition name="fade" mode="out-in">
                <component :is="aboutComponents[current]" />
            </Transition>
        </section>
        <section class="flex flex-column py-l">
            <div class="py-s">
                <div class="flex flex-evenly ">
                    <button class="flex flex-column flex-center-column button-articles"
                        @click="handleComponents('Values')">
                        <p class="pa-s">Values</p>
                        <img src="/img/Values.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        @click="handleComponents('Articles')">
                        <p class="pa-s">Articles</p>
                        <img src="/img/Articles.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        @click="handleComponents('OSS')">
                        <p class="pa-s">OSS</p>
                        <img src="/img/Open_Sources.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        @click="handleComponents('Languages')">
                        <p class="pa-s">Languages</p>
                        <img src="/img/Languages.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        @click="handleComponents('Links')">
                        <p class="pa-s">Links</p>
                        <img src="/img/Links.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                    <button class="flex flex-column flex-center-column button-articles"
                        @click="handleComponents('Hobbies')">
                        <p class="pa-s">Hobbies</p>
                        <img src="/img/Hobbies.png" alt="" :width="imgSize" class="img-about" />
                    </button>
                </div>
            </div>
            <div class="py-s flex flex-center relative">
                <img src="/img/Foto_Perfil.jpg" width="50%" class="img-perfil" />
                <div class="icon-position">
                    <SignatureJT />
                </div>
            </div>
        </section>
    </div>
</template>
<style scoped>
.twoColumns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.button-articles {
    cursor: pointer;
    color: var(--white);
    font-family: inherit;
    font-size: 1rem;
}

.img-perfil {
    border-radius: 0.5rem;
    min-width: 300px;
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