<script setup>
import ShowRel from '../components/main/ShowRel.vue';
import AboutMe from '../components/main/AboutMe.vue';
import Carousel from '../components/main/Carousel.vue';
import Content from '../components/main/Content.vue';
import RRSS from '../components/main/RRSS.vue';
</script>
<template>
  <div class="container">
    <ShowRel />
    <AboutMe class="py" />
    <Carousel class="py" />
    <Content class="py" />
    <RRSS class="py" />
  </div>
</template>
<style>
.title {
  font-size: 52px;
  color: var(--white);
  padding: 4rem 0;
    @media screen and (max-width: 500px) {
    font-size: 44px;
  }
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
  background-color: #222;
}
</style>