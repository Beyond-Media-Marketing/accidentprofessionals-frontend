<template>
  <div class="app-badge">
    <span class="app-badge__dot" />
    <span class="app-badge__text"><slot /></span>
  </div>
</template>

<style lang="scss" scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(248, 246, 244, 0.1);
  border: 1px solid rgba(248, 246, 244, 0.2);
  border-radius: var(--radius-pill);
  box-shadow: 0 0 24px 0 var(--color-accent-glow);
  width: fit-content;
  &__dot {
    width: 8px;
    height: 8px;
    background: var(--color-accent);
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__text {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-cream);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
}
</style>
