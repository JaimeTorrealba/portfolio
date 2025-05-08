<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const bgColor = computed(() => props.data.theme || '#adc0cf');
</script>
<template>
  <a :href="data.url" target="_blank" rel="noopener noreferrer" class="card-link">
    <div class="card">
      <div class="inner-wrapper">
        <p class="card-title">{{ data.title }}</p>
      </div>
      <div class="image-wrapper">
        <div v-if="!data.img" class="default-img"></div>
        <!-- <img :src="data.img" alt="Card Image" class="card-image" /> -->
      </div>
      <div class="inner-wrapper date-type">
        <p class="font-medium">{{ data.date }}</p>
        <p class="font-medium">{{ data.type }}</p>
      </div>
      <div class="inner-wrapper">
        <p class="card-description">{{ data.description }}</p>
      </div>
    </div>
  </a>
</template>
<style scoped lang="scss">
.default-img {
  height: 10rem;
  padding: 0.5rem;
}

.card {
  border: 0.5rem solid #111;
  border-radius: 1rem;
  padding: 1rem;
  background: url(/img/Noise.png) no-repeat center center;
  background-size: cover;
  background-color: v-bind(bgColor);
  max-width: 300px;
  transition: box-shadow 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 0px 0px 16px 0px #626f77;
}

.inner-wrapper {
  border-radius: 8px;
  border: 1px solid #111;
  background: #e4e4e4b7;
  box-shadow: 0px 0px 16px 0px #626f77 inset;
}

.date-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.25rem;
  color: #111;
}
.font-medium{
  font-weight: bold;
}

.image-wrapper {
  border-radius: 4px;
  border: 1px solid #fabf41;
  background: radial-gradient(83.73% 83.73% at 50% 50%, #adc0cf 23.08%, #111 100%);
  box-shadow: 0px 0px 8px 0px rgba(247, 247, 247, 0.5);
  display: flex;
  justify-content: center;
}

.card-title {
  font-size: var(--step-0);
  color: #111;
  text-wrap: balance;
  text-align: center;
  font-weight: 600;
  padding: 0.5rem 0.25rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  height: 70px;
}
.card-description {
  color: #111;
  padding: 0.5rem 0.25rem;
}

.card-image {
  height: 10rem;
  width: 50%;
  padding: 0.5rem;
}
</style>
