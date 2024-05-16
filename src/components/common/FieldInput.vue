<template>
  <!-- Input Field -->
  <q-input :model-value="modelValue"
           :label="label"
           :type="type"
           :autofocus="autoFocus"
           :autocomplete="autoComplete"
           :error="error !== undefined && error !== ''"
           :error-message="error"
           :rules="[value => (!mandatory || value?.toString().length > 0) || $t('error.emptyInputField') ]"
           lazy-rules="ondemand"
           stack-label
           filled
           dense
           @update:modelValue="value => modelValue = value" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: string | number | null;
  // Label of this component
  label: string;
  // The type of this input component
  type?: 'text' | 'textarea' | 'number' | 'password';
  // Flag controlling the field gains the focus on initialization
  autoFocus?: boolean;
  // AutoComplete attribute
  autoComplete?: string;
  // Flag controlling whether this input needs a non-empty model value
  mandatory?: boolean;
  // An optional error message to be displayed as hint
  error?: string;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Model Value Change Event
  (event: 'update:modelValue', value: string | number | null): void;
}>();

// Computed model value
const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emit('update:modelValue', value)
});

</script>
