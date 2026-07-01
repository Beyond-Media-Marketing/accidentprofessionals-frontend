<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :type="tag === 'button' ? type : undefined"
    class="app-btn"
    :class="[`app-btn--${variant}`, { 'app-btn--sm': size === 'sm' }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  href: { type: String, default: undefined },
  to: { type: String, default: undefined },
  tag: { type: String, default: 'button' },
})
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: var(--radius-pill);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base), opacity var(--transition-base);
  text-decoration: none;
}
.app-btn:hover { transform: translateY(-2px); }
.app-btn:active { transform: translateY(0); }

.app-btn--primary {
  background: var(--color-accent);
  color: var(--color-dark);
  box-shadow: var(--shadow-button);
}
.app-btn--primary:hover { box-shadow: 0px 24px 16px rgba(0,0,0,0.12), 0px 10px 6px rgba(0,0,0,0.12); }

.app-btn--dark {
  background: var(--color-dark);
  color: var(--color-cream);
}
.app-btn--dark:hover { opacity: 0.88; }

.app-btn--ghost {
  background: transparent;
  color: var(--color-cream);
  border: 1px solid rgba(248, 246, 244, 0.3);
}
.app-btn--ghost:hover { background: rgba(248, 246, 244, 0.08); }

.app-btn--sm {
  padding: 10px 20px;
  font-size: 14px;
}
</style>
