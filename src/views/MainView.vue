<script setup>
import ShowRel from "../components/main/ShowRel.vue";
import AboutMe from "../components/main/AboutMe.vue";
import Carousel from "../components/main/Carousel.vue";
import Content from "../components/main/Content.vue";
import RRSS from "../components/main/RRSS.vue";

</script>
<template>
  <div class="columns wrapper">
    <nav class="column is-one-quarter is-relative nav-style">
      <!-- <ul class="navbar debug">
        <li><a class="title" href="#showrel">ShowRel</a></li>
        <li><a href="#aboutme">AboutMe</a></li>
        <li><a href="#carousel">Carousel</a></li>
      </ul> -->
    </nav>
    <div class="column ">
      <!-- <ShowRel />
      <AboutMe class="py" />
      <Carousel class="py" /> -->
      <Content />
      <!-- <RRSS class="py" /> -->
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 2rem;
  font-family: 'Cascadia Code';
}
.nav-style{
  @media screen and (max-width: 1024px) {
    display: none;
  }
}
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
