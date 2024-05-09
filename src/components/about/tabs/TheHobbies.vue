<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";
import BaseTooltip from "../../common/BaseTooltip.vue";



onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headValues *', { delay: 0, stagger: 0.1 }))
    master.add(appear('#hobbiesList *', { delay: 0, stagger: 0.05 }), '-=0.5')
})

</script>
<template>
    <section>
        <div class="flex flex-column flex-center-column pb-l" id="headValues">
            <h3 class="center-text h2 py-s">Hobbies </h3>
            <img src="/img/Hobbies.png" alt="Values" width="96px" class="img-about" />
        </div>
        <div class="flex image-container" id="hobbiesList">
            <BaseTooltip Text="Making and drinking beer!">
                <img width="100%" src="/img/hobbies/beer.svg" alt="Beer hobbie" class="img-hobby" />
            </BaseTooltip>
            <BaseTooltip Text="I love cooking">
                <img width="100%" src="/img/hobbies/cook.svg" alt="cook hobbie" class="img-hobby" />
            </BaseTooltip>
            <BaseTooltip Text="When I was young I danced breakdance">
                <img width="100%" src="/img/hobbies/dance.svg" alt="dance hobbie" class="img-hobby" />
            </BaseTooltip>
            <BaseTooltip Text="My truly passion travel">
                <img width="100%" src="/img/hobbies/travel.svg" alt="travel hobbie" class="img-hobby" />
            </BaseTooltip>
            <BaseTooltip Text="More an addition, chess">
                <img width="100%" src="/img/hobbies/chess.svg" alt="travel hobbie" class="img-hobby" />
            </BaseTooltip>
            <BaseTooltip Text="Create programs with Code">
                <img width="100%" src="/img/hobbies/coding.svg" alt="travel hobbie" class="img-hobby" />
            </BaseTooltip>
            <BaseTooltip Text="A good book, read">
                <img width="100%" src="/img/hobbies/read.svg" alt="travel hobbie" class="img-hobby" />
            </BaseTooltip>
        </div>
    </section>

</template>
<style scoped>
.image-container {
    flex-wrap: wrap;
}

.img-hobby {
    margin: 1rem;
    max-width: 128px;
    border-radius: 0.25rem;
    background-color: rgb(200, 200, 200);
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