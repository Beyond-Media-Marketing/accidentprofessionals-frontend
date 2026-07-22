<template>
  <div class="app-badge">
    <span class="app-badge__dot" />
    <span class="app-badge__text"><slot /></span>
  </div>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  color: rgba(248, 246, 244, 0.6);
}
.app-badge__dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  flex-shrink: 0;
}
.app-badge__text {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: inherit;
}
</style>
