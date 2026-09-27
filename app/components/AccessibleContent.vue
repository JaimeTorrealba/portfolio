<script setup>
import {
  person,
  socials,
  experiences,
  content,
  contentTypeLabels,
  languageNames,
} from "#shared/profile";
</script>

<template>
  <!--
    Text version of the page. The scene is a canvas and the cards only exist while open,
    so without this the prerendered HTML has no content for crawlers, answer engines or
    screen readers. Same data as the cards, visually hidden. Links are tabindex="-1" so
    Tab keeps going to the visible menu; screen-reader browse mode still reaches them.
  -->
  <main class="visually-hidden">
    <h1>{{ person.name }} — {{ person.jobTitle }}</h1>
    <p v-for="paragraph in person.bio" :key="paragraph">{{ paragraph }}</p>

    <nav aria-label="Social profiles">
      <ul>
        <li v-for="social in socials" :key="social.url">
          <a :href="social.url" rel="me" tabindex="-1">{{ social.label }}</a>
          <template v-if="social.description"> — {{ social.description }}</template>
        </li>
      </ul>
    </nav>

    <section aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      <ol>
        <li v-for="item in experiences" :key="item.id">
          <h3>{{ item.role }} at {{ item.title }}</h3>
          <p>{{ item.period }}</p>
          <p>{{ item.description }}</p>
        </li>
      </ol>
    </section>

    <section aria-labelledby="content-heading">
      <h2 id="content-heading">Content</h2>
      <p>Talks, podcasts, courses, open source and games.</p>
      <ul>
        <li v-for="item in content" :key="item.id">
          <h3 :lang="item.lang">
            <a v-if="item.url" :href="item.url" tabindex="-1">{{ item.title }}</a>
            <template v-else>{{ item.title }}</template>
          </h3>
          <p>
            {{ contentTypeLabels[item.type] ?? item.type
            }}<template v-if="item.lang"> (in {{ languageNames[item.lang] }})</template>:
            {{ item.description }}
          </p>
        </li>
      </ul>
    </section>
  </main>
</template>
