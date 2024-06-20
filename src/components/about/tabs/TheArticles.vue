<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin.js'
import BaseLink from "@/components/common/BaseLink.vue";

gsap.registerPlugin(Draggable, InertiaPlugin);

onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headValues *', { delay: 0, stagger: 0.1 }))
    master.add(appear('.carousel', { delay: 0, y:0 }), "-=0.25")
    const slides = gsap.utils.toArray(".carousel li");
    const slidesCount = slides.length;
    const slideHeight = slides[0].offsetHeight;
    const circumFerence = (slidesCount * slideHeight) ;
    const radius = circumFerence / (2 * Math.PI);

    gsap.set(".carousel", { height: `${2 * Math.round(radius)}px` });
    slides.forEach((slide, index) => {
        gsap.set(slide, {
            yPercent: -50,
            z: radius,
            y: radius,
            rotateX: `${(index * 360) / slidesCount}deg`,
            transformOrigin: `50% 50% -${radius}px`
        });
    });
    const animation = gsap.to(slides, {
        rotateX: "-=360deg",
        ease: "none",
        paused: true
    });

    const proxy = document.createElement("div");
    Draggable.create(proxy, {
        type: "y",
        trigger: ".carousel ul",
        inertia: { y: { resistance: 4000 } },
        snap: {
            y: (y) => Math.round(y / slideHeight) * circumFerence
        },
        onDrag: updateProgress,
        onThrowUpdate: updateProgress
    });

    const wrapValue = gsap.utils.wrap(0, slidesCount * slideHeight);

    function updateProgress() {
        animation.progress(wrapValue(this.y) / circumFerence);
    }

})

const links = [
    { title: 'Multi-cameras with Tresjs', href: 'https://medium.com/stackademic/multi-cameras-with-tresjs-26a54d06878e' },
    { title: 'How to Create an Infinite Tube with Tresjs', href: 'https://medium.com/stackademic/how-to-create-an-infinite-tube-with-tresjs-e9ff4fc76e86' },
    { title: '3D Pixel art on the web', href: 'https://medium.com/@Jaimebboyjt/3d-pixel-art-on-the-web-f70fbf68fb4f' },
    { title: 'Transition Threejs component using VueJs and TresJs', href: 'https://medium.com/@Jaimebboyjt/transition-threejs-component-using-vuejs-and-tresjs-d1119cb8ef6c' },
    { title: 'How to use InstanceMesh with Tresjs', href: 'https://medium.com/@Jaimebboyjt/how-to-use-instancemesh-with-tresjs-fae8e3b48dcc' },
    { title: '3D con JavaScript - parte 1', href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-1-2k95' },
    { title: '3D con JavaScript - parte 2', href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-2-1jj8' },
    { title: '3D con JavaScript - parte 3', href: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-3-56cj' },
    { title: 'TresJs por una web con más 3D', href: 'https://dev.to/javascriptchile/tresjs-por-una-web-con-mas-3d-39d4' },
    { title: '¿Como es ser un mantenedor Open Source?', href: 'https://dev.to/jaimebboyjt/como-es-ser-un-mantenedor-open-source-4624' },
]

</script>
<template>
    <section class="w100" >
        <div class="flex flex-column flex-center-column pb-l" id="headValues">
            <h3 class="center-text h2 py-s">Articles </h3>
            <img src="/img/Articles.png" alt="Values" width="96px" class="img-about" />
        </div>
        <div class="carousel py-l">
            <ul class="py-l">
                <li v-for="link in links" :key="link.title">
                    <BaseLink :text="link.title" :href="link.href" />
                </li>
            </ul>
        </div>
    </section>
</template>
<style scoped>
.w100 {
    width: 100%;
}
.carousel {
    width: 100%;
    position: relative;
    display: grid;
    place-content: center;
    perspective: 1800px;
    overflow: hidden;
    border-radius: 1rem;

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        li {
            text-align: center;
            white-space: nowrap;
            position: absolute;
            width: 100%;
            line-height: 5rem;
            font-size: 2rem;
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }
    }
}


.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}

.pb-l {
    padding-bottom: 2rem;

}
</style>