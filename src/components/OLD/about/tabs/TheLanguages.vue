<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";
import LanguagesBar from "@/assets/icons/LanguagesBar.vue";

const animateBar = (bar) => {
    const idBar = document.getElementById(bar)
    const barToClip = idBar.querySelector('.barToClip')
    const barToAnimate = barToClip.querySelector('.barToAnimate')

    const tl = gsap.timeline()
        .to(barToAnimate, { y: -37, duration: 1, ease: "power2.inOut" })
    return tl
}
// .barToAnimate

onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headLanguages *', { delay: 0, stagger: 0.1 }))
    master.add(appear('.appear', { delay: 0, y:0 }))
    master.add(animateBar('spanishBar'), '-=0.5')
    master.add(animateBar('englishBar'), '-=0.5')
    master.add(animateBar('italianBar'), '-=0.5')
    master.add(animateBar('germanBar'), '-=0.5')
})

</script>
<template>
    <section class="section-languages">
        <div class="flex flex-column flex-center-column pb-l" id="headLanguages">
            <h3 class="center-text h2 py-s">Languages </h3>
            <img src="/img/Languages.png" alt="Values" width="96px" class="img-about" />
        </div>

        <div class="flex flex-between gab px-l appear">
            <div class="flex flex-column flex-center-column flex-between px">
                <h4 class="h3"> Spanish </h4>
                <LanguagesBar :width="100" id="spanishBar" />
                Native
            </div>
            <div class="flex flex-column flex-center-column flex-between px">
                <h4 class="h3"> English </h4>
                <LanguagesBar id="englishBar" />
                B1
            </div>
            <div class="flex flex-column flex-center-column flex-between px">
                <h4 class="h3"> Italian </h4>
                <LanguagesBar id="italianBar" />
                B1
            </div>
            <div class="flex flex-column flex-center-column flex-between px">
                <h4 class="h3"> German </h4>
                <LanguagesBar :width="50" id="germanBar" />
                A1
            </div>
        </div>
        <p class="py-l helper-text appear">*All the levels are certified and based on the CEFR.</p>
    </section>
</template>
<style scoped>
.helper-text {
    font-size: var(--step--2);
    color: var(--gold);
}

.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}

li {
    margin-bottom: 1rem;
    text-indent: 1rem;
    list-style-type: disc;

}

.pb-l {
    padding-bottom: 2rem;

}
</style>