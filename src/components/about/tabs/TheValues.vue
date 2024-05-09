<script setup>
import { onMounted } from "vue";
import { appear } from "@/utils/gsaps";
import { gsap } from "gsap";


onMounted(() => {
    const master = gsap.timeline()
    master.add(appear('#headValues *', { delay: 1, stagger: 0.1 }))
    master.add(appear('#listValues *', { delay: 0, stagger: 0.05 }))
})

</script>
<template>
    <section>
        <div class="flex flex-column flex-center-column pb-l" id="headValues">
            <h3 class="center-text h2 py-s">My Values </h3>
            <img src="/img/Values.png" alt="Values" width="96px" class="img-about" />
        </div>
        <ul id="listValues">
            <li><strong class="bloom-effect-tiny">Passion</strong>: I love code and I love beautiful code. I believe the code you deliver says
                something about you and
                you should be proud of it. I also love design, 3D design, pixel-art and illustration. Although there is
                a
                long path ahead of me, I do it for the enjoyment.</li>
            <li>
                <strong class="bloom-effect-tiny">Team work</strong>: Having worked as both a solo developer and within a team, I would always
                choose working with
                a
                team, not only because you can discuss and see different points of view, but also because you have more
                opportunities to learn and grow so you progress faster and better.
            </li>
            <li>
                <strong class="bloom-effect-tiny">Creative</strong>: My interest in design is my true passion (it is why I like the front-end).
                In my free time I
                work
                on my own creative lab where I share my GPU experiments with the community. As a hobby, I am learning
                Unreal
                Engine and Blender.
            </li>
            <li>
                <strong class="bloom-effect-tiny">Self-learning</strong>: Curious by nature, if I don’t know the answer I will search for it,
                hence I have done
                many
                courses on different subjects like 3D Modelling, UI/UX, coding techniques and photogrammetry. Many of my
                achievements start this way.
            </li>
            <li>
                <strong class="bloom-effect-tiny">Mentoring</strong>: I benefit a lot from contributing to different tech communities, and
                supporting others if I
                can,
                teaching both the whys and hows of coding. I have taught private classes, created an online course for
                EDTeam and write on different blog platforms.
            </li>
            <li>
                <strong class="bloom-effect-tiny">Grateful</strong>: I am grateful for the opportunities I have had, the people I have met and the
                things I have learned.I tried to give thanks everyday, and to everyone who has helped me in some way.
            </li>
        </ul>
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