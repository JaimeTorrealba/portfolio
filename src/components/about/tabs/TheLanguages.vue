<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";


onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headLanguages *', { delay: 0, stagger: 0.1 }), '<')
})

</script>
<template>
    <section>
        <div class="flex flex-column flex-center-column pb-l" id="headLanguages">
            <h3 class="center-text h2 py-s">Languages </h3>
            <img src="/img/Languages.png" alt="Values" width="96px" class="img-about" />
        </div>
    </section>
</template>
<style scoped>
.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}

li {
    margin-bottom: 1rem;
    text-indent: 1rem;
    list-style-type: disc;

}
.pb-l{
    padding-bottom: 2rem;

}

</style>