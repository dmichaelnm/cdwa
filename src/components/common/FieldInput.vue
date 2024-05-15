<template>
  <!-- Input Field -->
  <q-input :model-value="modelValue"
           :label="label"
           :type="type"
           :autofocus="autoFocus"
           :autocomplete="autoComplete"
           stack-label
           filled
           dense
           @update:modelValue="value => modelValue = value"/>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: any;
  // Label of this component
  label: string;
  // The type of this input component
  type?: 'text' | 'textarea' | 'number' | 'password';
  // Flag controlling the field gains the focus on initialization
  autoFocus?: boolean;
  // AutoComplete attribute
  autoComplete?: string;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Model Value Change Event
  (event: 'update:modelValue', value: any): void;
}>();

// Computed model value
const modelValue = computed({
  get: () => props.modelValue,
  set: (value: any) => emit('update:modelValue', value)
});

</script>
