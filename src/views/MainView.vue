<script setup>
import Carousel from '../components/main/Carousel.vue';
import AboutMe from '../components/main/AboutMe.vue';
import RRSS from '../components/main/RRSS.vue';
</script>
<template>
  <div class="container" >
    <h1>MainView</h1>
    <AboutMe />
    <Carousel />
    <RRSS />
  </div>
</template>
<style scoped>
.container{
  min-height: 100vh;
  background-color: #111;
}
</style>