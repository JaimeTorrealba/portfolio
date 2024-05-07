<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";


onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headValues *', { delay: 0, stagger: 0.1 }))
    master.add(appear('.articles-section-title', { delay: 0, y: 0 }), "-=0.25")
    master.add(appear('.listArticles *', { delay: 0, stagger: 0.05 }), '-=0.5')
})

const englishLinks = [
    { title: 'Multi-cameras with Tresjs', href: 'https://medium.com/stackademic/multi-cameras-with-tresjs-26a54d06878e' },
    { title: 'How to Create an Infinite Tube with Tresjs', href: 'https://medium.com/stackademic/how-to-create-an-infinite-tube-with-tresjs-e9ff4fc76e86' },
    { title: '3D Pixel art on the web', href: 'https://medium.com/@Jaimebboyjt/3d-pixel-art-on-the-web-f70fbf68fb4f' },
    { title: 'Transition Threejs component using VueJs and TresJs', href: 'https://medium.com/@Jaimebboyjt/transition-threejs-component-using-vuejs-and-tresjs-d1119cb8ef6c' },
    { title: 'How to use InstanceMesh with Tresjs', href: 'https://medium.com/@Jaimebboyjt/how-to-use-instancemesh-with-tresjs-fae8e3b48dcc' },
]

const spanishLinks = [
    { title: 'Programación 3D con JavaScript - parte 1', href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-1-2k95' },
    { title: 'Programación 3D con JavaScript - parte 2', href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-2-1jj8' },
    { title: 'Programación 3D con JavaScript - parte 3', href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-3-56cj' },
    { title: 'TresJs por una web con más 3D', href: 'https://dev.to/javascriptchile/tresjs-por-una-web-con-mas-3d-39d4' },
    { title: '¿Como es ser un mantenedor Open Source?', href: 'https://dev.to/jaimebboyjt/como-es-ser-un-mantenedor-open-source-4624' },

]

</script>
<template>
    <section>
        <div class="flex flex-column flex-center-column pb-l" id="headValues">
            <h3 class="center-text h2 py-s">Articles </h3>
            <img src="/img/Articles.png" alt="Values" width="96px" class="img-about" />
        </div>
        <nav>
            <h4 class="py h3 articles-section-title">English post</h4>
            <ul class="listArticles">
                <li v-for="link in englishLinks" :key="link.title">
                    <a :href="link.href" target="_blank" rel="no-referrer">{{ link.title }}</a>
                </li>
            </ul>
        </nav>
        <nav>
            <h4 class="py h3 articles-section-title">Spanish post</h4>
            <ul class="listArticles">
                <li v-for="link in spanishLinks" :key="link.title">
                    <a :href="link.href" target="_blank" rel="no-referrer">{{ link.title }}</a>
                </li>
            </ul>
        </nav>
    </section>
</template>
<style scoped>
.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}

li {
    margin-bottom: 0.5rem;
    text-indent: 1rem;
    list-style-type: disc;
    text-decoration: underline;
}

.pb-l {
    padding-bottom: 2rem;

}
</style>