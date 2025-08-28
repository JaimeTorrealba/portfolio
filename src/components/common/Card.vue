<script setup>
import {
  DocumentTextIcon,
  ChevronRightIcon,
  MicrophoneIcon,
  PhotoIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/vue/24/solid";
defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const iconComponent = {
  Blog: DocumentTextIcon,
  Course: AcademicCapIcon,
  Talk: ChatBubbleOvalLeftEllipsisIcon,
  Podcast: MicrophoneIcon,
  Asset: PhotoIcon,
  OSS: CodeBracketIcon,
};
</script>
<template>
  <a :href="data.url" target="_blank" rel="noopener noreferrer">
    <div class="custom-item p-2 is-flex is-justify-content-space-between">
      <div class="is-flex gap-4">
        <div
          class="start-icon-section is-flex is-flex-direction-column is-justify-content-center is-align-content-center"
        >
          <component
            :is="iconComponent[data.type]"
            class="icon is-medium has-text-grey-light"
          />
          <p class="is-size-7 has-text-grey-light has-text-centered">{{ data.type }}</p>
        </div>
        <div
          class="text-section is-flex is-flex-direction-column is-justify-content-center"
        >
          <p class="is-size-4 has-text-weight-medium has-text-light">
            {{ data.title }}
          </p>
          <p class="has-text-grey-light">{{ data.description }}</p>
        </div>
      </div>
      <div class="is-flex is-flex-direction-column is-justify-content-center">
        <ChevronRightIcon class="icon" />
      </div>
    </div>
  </a>
</template>
<style scoped>
a {
  color: #f7f7f7;
}
.custom-item {
  border: 1px solid #f7f7f7;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(247, 247, 247, 0.25);
  }
}

.gap-4 {
  gap: 1rem;
}
</style>
