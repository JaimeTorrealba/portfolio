<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <a :href="data.url" target="_blank" rel="noopener noreferrer" class="card-link">
    <div class="card">
      <div class="inner-wrapper">
        <p class="card-title">{{ data.title }}</p>
      </div>
      <div class="image-wrapper">
        <div class="test"></div>
        <!-- <img :src="data.image" alt="Card Image" class="card-image" /> -->
      </div>
      <div class="inner-wrapper date-type">
        <p>{{ data.date }}</p>
        <p>{{ data.type }}</p>
      </div>
      <div class="inner-wrapper">
        <p class="card-description">{{ data.description }}</p>
      </div>
    </div>
  </a>
</template>
<style scoped lang="scss">
.test{
    height: 10rem;
}
.card {
  border: 0.5rem solid #111;
  border-radius: 1rem;
  padding: 1rem;
  background: url(/img/Noise.png) no-repeat center center;
  background-size: cover;
  background-color: #adc0cf;
  max-width: 300px;
}

.inner-wrapper {
  border-radius: 8px;
  border: 1px solid #111;
  background: #e4e4e4;
  box-shadow: 0px 0px 16px 0px #626f77 inset;
}

.date-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.25rem;
  color: #111;
}

.image-wrapper {
  border-radius: 4px;
  border: 1px solid #fabf41;
  background: radial-gradient(83.73% 83.73% at 50% 50%, #111 23.08%, #adc0cf 100%);
  box-shadow: 0px 0px 8px 0px rgba(247, 247, 247, 0.5);
}

.card-title {
  font-size: var(--step-1);
  color: #111;
  text-wrap: balance;
  font-weight: 600;
  padding: 0.5rem 0.25rem;
}
.card-description {
  color: #111;
  padding: 0.5rem 0.25rem;
}
</style>
