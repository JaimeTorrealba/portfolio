<script setup></script>
<template>
  <div data-theme="dark" class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <slot name="media-left"></slot>
        </div>
        <div class="media-content">
          <slot name="media-content"></slot>
        </div>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
