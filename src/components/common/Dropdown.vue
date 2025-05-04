<script setup>

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const modelValue = defineModel('modelValue', {
  type: String,
  required: true,
});

function selectItem(item) {
  modelValue.value = item;
}
</script>

<template>
  <tippy
    interactive
    placement="bottom"
    trigger="click"
    class="dropdown"
  >
    <template #default>
      <button class="dropdown-button">{{ modelValue || 'All' }}</button>
    </template>
    <template #content>
      <ul class="dropdown-menu">
        <li
          class="dropdown-item"
          @click="selectItem('All')"
        >
          All
        </li>
        <li
          v-for="(item, index) in items"
          :key="index"
          class="dropdown-item"
          @click="selectItem(item)"
        >
          {{ item }}
        </li>
      </ul>
    </template>
  </tippy>
</template>

<style scoped>
.dropdown-button {
  padding: 8px 4rem;
  background-color: #111;
  border: 1px solid #ccc;
  color: #f7f7f7;
  border-radius: 0.5rem;
  font-size: var(--step-0);
  cursor: pointer;
}

.dropdown-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: var(--step--1);
  transition: all 0.15s ease;
  background-color: #111;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #e0e0e0;
  color: #111;
}
</style>