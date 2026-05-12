<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="app-input__label">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      class="app-input__field"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps({
  id: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  modelValue: String,
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.app-input {
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

  &__field {
    width: 100%;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.6);
    border: none;
    border-radius: var(--radius-sm);
    font-size: 16px;
    color: var(--color-dark);
    outline: none;
    transition: background var(--transition-base), box-shadow var(--transition-base);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);

    &::placeholder { color: #525252; }

    &:focus {
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 2px var(--color-accent);
    }
  }
}
</style>
