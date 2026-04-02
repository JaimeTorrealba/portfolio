<script setup></script>
<template>
  <button class="close-btn" aria-label="Close card">
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L11 11M11 1L1 11"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.close-btn {
  position: absolute;
  top: -14px;
  left: calc(100% - 14px);
  z-index: 10;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  background: hsl(0 0% 100% / 0.08);
  border: 1px solid hsl(0 0% 100% / 0.15);
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: hsl(0 0% 100% / 0.18);
}
</style>
