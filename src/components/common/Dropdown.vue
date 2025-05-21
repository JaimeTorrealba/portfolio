<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const modelValue = defineModel("modelValue", {
  type: String,
  required: true,
});

function selectItem(item) {
  modelValue.value = item;
}
</script>

<template>
  <tippy interactive placement="bottom" trigger="click" class="dropdown">
    <template #default>
      <button class="dropdown-button">
        {{ modelValue || "All" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="24px"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="dropdown-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
      </button>
    </template>
    <template #content>
      <ul class="dropdown-menu">
        <li class="dropdown-item" @click="selectItem('All')">All</li>
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
  padding: 0.5rem 4rem 0.5rem 1.5rem;
  background-color: #111;
  border: 1px solid #ccc;
  color: #f7f7f7;
  border-radius: 0.5rem;
  font-size: var(--step-0);
  cursor: pointer;
  position: relative;
}

.dropdown-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
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
