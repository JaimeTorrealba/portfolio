<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";
import BaseTooltip from "../../common/BaseTooltip.vue";



onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headValues *', { delay: 0, stagger: 0.1 }))
    master.from('.hex-grid__content', {x: 100, y : 0, stagger: 0.1, duration: 1, opacity: 0, ease: 'power2.out'}, '-=0.75')
    master.from('.img-hobby', {x: -100, y : 0, stagger: 0.1, duration: 1, opacity: 0, ease: 'power2.out'}, '<')
})

const hobbies = [
    { src: '/img/hobbies/beer.svg', alt: 'Beer hobbie', text: 'Brewing!' },
    { src: '/img/hobbies/cook.svg', alt: 'cook hobbie', text: 'Cooking, mostly Italian' },
    { src: '/img/hobbies/dance.svg', alt: 'dance hobbie', text: 'When I was young I did breakdance' },
    { src: '/img/hobbies/travel.svg', alt: 'travel hobbie', text: 'My truly passion travel' },
    { src: '/img/hobbies/chess.svg', alt: 'chess hobbie', text: 'My addiction chess' },
    { src: '/img/hobbies/coding.svg', alt: 'coding hobbie', text: 'Creative code' },
    { src: '/img/hobbies/read.svg', alt: 'read hobbie', text: 'To read good books' },
    // Trekking
    // OSS
]
</script>
<template>
    <section>
        <div class="flex flex-column flex-center-column pb-l" id="headValues">
            <h3 class="center-text h2 py-s">Hobbies </h3>
            <img src="/img/Hobbies.png" alt="Values" width="96px" class="img-about" />
        </div>
        <ul class="hex-grid__list">
            <li class="hex-grid__item" v-for="{ text, src, alt } in hobbies" :key="src">
                <div class="hex-grid__content">
                    <BaseTooltip :Text="text">
                        <img width="100%" :src="src" :alt="alt" class="img-hobby" />
                    </BaseTooltip>
                </div>
            </li>

        </ul>
    </section>

</template>
<style lang="scss" scoped>
$amount: 5;

.hex-grid__list {
    --amount: 5;
    --counter: 1;
    display: grid;
    list-style-type: none;
    margin: 0;
    padding: 0;
    grid-template-columns: repeat(var(--amount), 1fr, 2fr) 1fr;
    grid-gap: 1rem 2rem;
}

.hex-grid__item {
    position: relative;
    grid-column: 1 / span 3;
    grid-row: calc(var(--counter) + var(--counter)) / span 2;
    height: 0;
    padding-bottom: 100%;

    // Columns
    @for $i from 1 through $amount {
        &:nth-of-type(#{$amount}n + #{$i}) {
            grid-column: #{$i + $i - 1} / span 3;

            @if $i % 2==0 {
                grid-row: calc(var(--counter) + var(--counter) - 1) / span 2;
            }
        }
    }

    // Rows
    @for $i from 1 through 20 {
        &:nth-of-type(n + #{$i * $amount + 1}) {
            --counter: #{$i + 1};
        }
    }
}

.hex-grid__content {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: white;
    clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
}

.img-hobby {
    max-width: 128px;
    border-radius: 0.25rem;
    background-color: #f7f7f7;
}

.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}


.pb-l {
    padding-bottom: 2rem;
}
</style>