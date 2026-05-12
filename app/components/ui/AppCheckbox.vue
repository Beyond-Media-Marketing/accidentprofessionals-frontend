<template>
  <label class="app-checkbox">
    <div class="app-checkbox__input-wrap">
      <input
        type="checkbox"
        class="app-checkbox__input"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="app-checkbox__box">
        <svg
          v-if="modelValue"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 6L5 9L10 3"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <span class="app-checkbox__text"><slot /></span>
  </label>
</template>

<script setup lang="ts">
defineProps({ modelValue: Boolean });
defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.app-checkbox {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;

  &__input-wrap {
    position: relative;
    flex-shrink: 0;
    padding-top: 2px;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 1px solid #d4d4d4;
    border-radius: 6px;
    background: transparent;
    transition: background var(--transition-base),
      border-color var(--transition-base);

    .app-checkbox__input:checked + & {
      background: var(--color-accent);
      border-color: var(--color-accent);
    }
  }

  &__text {
    font-size: 14px;
    color: var(--color-white);

    :deep(a) {
      text-decoration: underline;
      color: var(--color-white);
    }
  }
}
</style>
