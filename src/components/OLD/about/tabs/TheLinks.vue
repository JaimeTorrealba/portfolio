<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'radix-vue'
import Chevron from '@/assets/icons/ChevronIcon.vue'
import BaseLink from "@/components/common/BaseLink.vue";



onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headOSS *', { delay: 0, stagger: 0.1 }))
    master.add(appear('.AccordionHeader', { delay: 0, stagger: 0.05 }), '-=0.5')
})

const Models = [
    { title: 'Sketchfab', href: 'https://sketchfab.com/solucionesinformaticasjtc' },
    { title: 'Artstation', href: 'https://www.artstation.com/jaimebboyjt' },
    // { title: 'CGTrader', href: '' },
    // { title: 'Blender Market', href: '' },
    // { title: 'Poly Pizza', href: '' },
]

const Course = [
    { title: 'ThreeJs desde 0 (EDteam)', href: 'https://ed.team/cursos/threejs' },
    { title: 'TresJS desde 0 (Udemy - soon)', href: '' },
]

const Others = [
    { title: 'Codepen', href: 'https://codepen.io/jaime_torrealba' },
    { title: 'Instagram', href: 'https://www.instagram.com/jaimebboyjt/' },
    { title: 'Dribbble', href: 'https://dribbble.com/Jaime_Torrealba' },
    { title: 'Youtube', href: 'https://www.youtube.com/channel/UCUxpOj2vNhEVD3rGWeP_1GQ' },
]

const accordionItems = [
    {
        value: 'item-1',
        title: '3D Models',
        content: Models,
    },
    {
        value: 'item-2',
        title: 'Courses',
        content: Course,
    },
    {
        value: 'item-3',
        title: 'Others RRSS',
        content: Others,
    },
]
</script>
<template>
    <section>
        <div class="flex flex-column flex-center-column pb-l" id="headOSS">
            <h3 class="center-text h2 py-s">Links</h3>
            <img src="/img/Links.png" alt="Open source" width="96px" class="img-about" />
        </div>
        <AccordionRoot class="AccordionRoot" default-value="'item-1'" type="single" :collapsible="true">
            <template v-for="item in accordionItems" :key="item.value">
                <AccordionItem class="AccordionItem" :value="item.value">
                    <AccordionHeader class="AccordionHeader">
                        <AccordionTrigger class="AccordionTrigger">
                            <h4 class="h4">{{ item.title }}</h4>
                            <Chevron class="AccordionChevron" />
                        </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent class="AccordionContent">
                        <nav class="AccordionContentText">
                            <ul>
                                <li v-for="link in item.content" :key="link.title">
                                    <BaseLink :text="link.title" :href="link.href" />
                                </li>
                            </ul>
                        </nav>
                    </AccordionContent>
                </AccordionItem>
            </template>
        </AccordionRoot>
    </section>
</template>
<style scoped>
.img-about {
    border-radius: 0.5rem;
    background-color: #e4e4e4;
}

li {
    margin-bottom: 0.75rem;
    text-indent: 1rem;
    list-style-type: disc;
}

.pb-l {
    padding-bottom: 2rem;
}

/* reset */
button {
    all: unset;
}

.AccordionRoot {
    border-radius: 6px;
    width: 450px;
}

.AccordionItem {
    overflow: hidden;
    margin-top: 1px;
}

.AccordionItem:first-child {
    margin-top: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.AccordionItem:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.AccordionItem:focus-within {
    position: relative;
    z-index: 1;
}

.AccordionHeader {
    display: flex;
}

.AccordionTrigger {
    font-family: inherit;
    background-color: transparent;
    padding: 0 20px;
    height: 45px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    line-height: 1;
    transition: all 0.3s;
    cursor: pointer;
}

.AccordionTrigger:hover {
    background-color: rgba(3, 3, 3, 0.5);
}

.AccordionContent {
    overflow: hidden;
    font-size: 15px;
}

.AccordionContent[data-state='open'] {
    animation: slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1);
}

.AccordionContent[data-state='closed'] {
    animation: slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1);
}

.AccordionContentText {
    padding: 15px 20px;
}

.AccordionChevron {
    color: #e4e4e4;
    transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
}

.AccordionTrigger[data-state='open']>.AccordionChevron {
    transform: rotate(180deg);
}

@keyframes slideDown {
    from {
        height: 0;
    }

    to {
        height: var(--radix-accordion-content-height);
    }
}

@keyframes slideUp {
    from {
        height: var(--radix-accordion-content-height);
    }

    to {
        height: 0;
    }
}
</style>