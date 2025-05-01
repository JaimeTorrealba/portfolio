<script setup>
import Carousel from '../components/main/Carousel.vue';
import AboutMe from '../components/main/AboutMe.vue';
import RRSS from '../components/main/RRSS.vue';
import ShowRel from '../components/main/ShowRel.vue';
</script>
<template>
  <div class="container">
    <ShowRel />
    <AboutMe class="py" />
    <Carousel class="py" />
    <RRSS class="py" />
  </div>
</template>
<style>
.title {
  font-size: var(--step-4);
  color: var(--white);
  padding: 4rem 0;
}
.py{
  padding: 4rem 0;
}
.overflow-hidden-y{
  overflow-y: hidden;
}

.container{
  min-height: 100vh;
  padding: 0 2rem;
  background-color: #111;
}
</style>