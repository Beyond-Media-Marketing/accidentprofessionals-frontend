<template>
  <div class="app-select">
    <label v-if="label" :for="id" class="app-select__label">{{ label }}</label>
    <div class="app-select__wrapper">
      <select
        :id="id"
        class="app-select__field"
        :value="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <span class="app-select__chevron">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: String,
  options: {
    type: Array as () => { value: string; label: string }[],
    default: () => [],
  },
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.app-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-white);
    letter-spacing: -0.01em;
  }

  &__wrapper {
    position: relative;
  }

  &__field {
    width: 100%;
    padding: 10px 40px 10px 14px;
    background: rgba(255, 255, 255, 0.6);
    border: none;
    border-radius: var(--radius-sm);
    font-size: 16px;
    color: var(--color-dark);
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: background var(--transition-base), box-shadow var(--transition-base);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);

    &:focus {
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 2px var(--color-accent);
    }
  }

  &__chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #525252;
    pointer-events: none;
    display: flex;
  }
}
</style>
