<template>
  <div :class="['app-phone', `app-phone--${variant}`]">
    <!-- Code selector: custom display + transparent native select on top -->
    <div class="app-phone__code-wrap">
      <span class="app-phone__code-display" aria-hidden="true">
        {{ selectedCountry?.flag }} {{ selectedCountry?.dial }}
      </span>
      <select
        :value="code"
        @change="onCodeChange"
        class="app-phone__select"
        aria-label="Country code"
      >
        <option
          v-for="country in countries"
          :key="country.code"
          :value="country.code"
        >{{ country.flag }} {{ country.name }} ({{ country.dial }})</option>
      </select>
    </div>

    <input
      :id="inputId"
      :value="phone"
      @input="onPhoneInput"
      type="tel"
      :placeholder="placeholder"
      autocomplete="tel"
      class="app-phone__field"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { countries } from '../../data/countries'

const props = withDefaults(defineProps<{
  phone: string
  code: string
  variant?: 'hero' | 'contact'
  inputId?: string
  placeholder?: string
}>(), {
  variant: 'hero',
  placeholder: '(555) 000-0000',
  inputId: 'phone-field',
})

const selectedCountry = computed(() => countries.find(c => c.code === props.code))

const emit = defineEmits<{
  'update:phone': [value: string]
  'update:code': [value: string]
}>()

function onCodeChange(e: Event) {
  emit('update:code', (e.target as HTMLSelectElement).value)
}

function onPhoneInput(e: Event) {
  emit('update:phone', (e.target as HTMLInputElement).value)
}
</script>

<style scoped>
.app-phone {
  display: flex;
  overflow: hidden;
}
.app-phone__code-wrap {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.app-phone__code-display {
  pointer-events: none;
  white-space: nowrap;
  font-family: var(--font-primary);
}
.app-phone__select {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.app-phone__field {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-primary);
}
.app-phone__field::placeholder { color: #b0aca8; }

/* ── Hero variant ── */
.app-phone--hero {
  background: rgba(255, 255, 255, 0.88);
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  transition: box-shadow var(--transition-base);
}
.app-phone--hero:focus-within { box-shadow: 0 0 0 2px var(--color-accent); }
.app-phone--hero .app-phone__code-wrap {
  padding: 10px 6px 10px 10px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.app-phone--hero .app-phone__code-display {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-dark);
}
.app-phone--hero .app-phone__field {
  padding: 10px 8px;
  font-size: 15px;
  color: var(--color-dark);
}
.app-phone--hero .app-phone__field::placeholder { color: #767676; }

/* ── Contact variant ── */
.app-phone--contact {
  border: 1px solid #e2e0dd;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.app-phone--contact:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(248, 192, 28, 0.15);
}
.app-phone--contact .app-phone__code-wrap {
  padding: 10px 8px 10px 12px;
  background: #f8f6f4;
  border-right: 1px solid #e2e0dd;
}
.app-phone--contact .app-phone__code-display {
  font-size: 14px;
  font-family: var(--font-secondary);
  color: var(--color-dark);
}
.app-phone--contact .app-phone__field {
  padding: 10px 14px;
  font-size: 15px;
  font-family: var(--font-secondary);
  color: var(--color-dark);
  background: var(--color-white);
}
</style>
