<script setup>
// import ShowRel from "../components/main/ShowRel.vue";
import AboutMe from "../components/main/AboutMe.vue";
import Experience from "../components/main/Experience.vue";
import Content from "../components/main/Content.vue";
import RRSS from "../components/main/RRSS.vue";

import YogSothoth from "@/assets/icons/Lovecraft/YogSothoth.vue";
import Ghatanothoa from "@/assets/icons/Lovecraft/Ghatanothoa.vue";
import Azathoth from "@/assets/icons/Lovecraft/Azathoth.vue";
import Nyarlathotep from "@/assets/icons/Lovecraft/Nyarlathotep.vue";
</script>
<template>
  <div class="columns wrapper">
    <nav class="column is-one-quarter is-relative nav-style">
      <ul
        class="navbar is-flex is-flex-direction-column is-align-items-flex-start is-justify-content-flex-start"
      >
        <!-- <li><a class="title" href="#showrel">ShowRel</a></li> -->
        <li>
          <a class="title is-flex is-align-items-center link" href="#aboutme">
            <YogSothoth /> AboutMe</a
          >
        </li>
        <li>
          <a class="title is-flex is-align-items-center link" href="#experience">
            <Azathoth height="24" /> Experience</a
          >
        </li>
        <li>
          <a class="title is-flex is-align-items-center link" href="#content">
            <Ghatanothoa /> Content</a
          >
        </li>
        <li>
          <a class="title is-flex is-align-items-center link" href="#rrss">
            <Nyarlathotep /> RRSS</a
          >
        </li>
      </ul>
    </nav>
    <div class="column">
      <!-- <ShowRel /> -->
      <AboutMe />
      <Experience />
      <Content />
      <RRSS />
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 2rem;
  font-family: "Sentient";
}
.nav-style {
  @media screen and (max-width: 1024px) {
    display: none;
  }
}
.navbar {
  position: sticky;
  top: 1rem;
  z-index: 10;
  gap: 1rem;
}
.link {
  transition: all 0.15s ease;
}
.link:hover {
  color: var(--gold);
  transform: scale(1.05);
  & svg {
    filter: drop-shadow(0 0 2px var(--gold));
  }

}
</style>
