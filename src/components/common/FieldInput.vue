<template>
  <!-- Input Field -->
  <q-input ref="input"
           :model-value="modelValue"
           :label="label"
           :type="type"
           :autofocus="autoFocus"
           :autocomplete="autoComplete"
           :error="error !== undefined && error !== ''"
           :error-message="error"
           :rules="[value => (!mandatory || value?.toString().length > 0) || $t('error.emptyInputField') ]"
           :rows="type === 'textarea' ? 2 : 1"
           :borderless="borderless"
           :standout="!borderless"
           :square="squared"
           :readonly="readonly"
           :hide-hint="hideBottomSpace"
           :hide-bottom-space="hideBottomSpace"
           :stack-label="!noStackLabel"
           :clearable="clearable"
           lazy-rules="ondemand"
           spellcheck="false"
           dense
           @update:modelValue="value => modelValue = upperCase && typeof value === 'string' ? value.toUpperCase() : value"
           @clear="emit('clear')">
    <!-- Template: Prepend Icon -->
    <template #prepend v-if="iconPrepend">
      <!-- Prepend Icon -->
      <q-icon :name="iconPrepend" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QInput } from 'quasar';

// Input reference
const input = ref<QInput | null>(null);

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: string | number | null;
  // Label of this component
  label?: string;
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
  // Flag controlling whether this input field is readonly
  readonly?: boolean;
  // Flag controlling whether this input field is borderless
  borderless?: boolean;
  // Flag controlling whether the value of this input field is in uppercase
  upperCase?: boolean;
  // Flag controlling whether the bottom space is hidden
  hideBottomSpace?: boolean;
  // Flag controlling whether the field is squared
  squared?: boolean;
  // Prepend Icon
  iconPrepend?: string;
  // Flag controlling whether the label is not stacked
  noStackLabel?: boolean;
  // Flag controlling whether this input is clearable
  clearable?: boolean;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Model Value Change Event
  (event: 'update:modelValue', value: string | number | null): void;
  // Clearable Event
  (event: 'clear'): void;
}>();

// Computed model value
const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => emit('update:modelValue', value)
});

/**
 * Selects the text within an input field.
 * If the input field has a value, it will be selected.
 *
 * @return {void}
 */
function select(): void {
  input.value?.select();
}

// Exposed functions
defineExpose({ select });

</script>
