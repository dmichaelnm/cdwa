<template>
  <!-- Select Component -->
  <q-select ref="select"
            :model-value="modelValue"
            :label="label"
            :options="options"
            :borderless="borderless"
            :standout="!borderless"
            :autocomplete="autoComplete"
            :readonly="readonly"
            :hide-dropdown-icon="readonly"
            stack-label
            dense
            options-dense
            map-options
            emit-value
            @update:modelValue="value => modelValue = value">
    <!-- Template: Icon -->
    <template #prepend v-if="icon || showIcons">
      <!-- Icon -->
      <q-icon :name="showIcons ? selectedIcon : icon"/>
    </template>
    <!-- Template Selected -->
    <template #selected>
      {{ selectedLabel }}
    </template>
    <!-- Template: Option -->
    <template #option="props">
      <!-- Option Item -->
      <q-item dense
              clickable
              v-close-popup
              v-bind="props.itemProps">
        <!-- Option Icon Section -->
        <q-item-section avatar v-if="showIcons">
          <!-- Option Icon -->
          <q-icon :name="props.opt.icon" :size="optionIconSize" />
        </q-item-section>
        <!-- Option Label Section -->
        <q-item-section>
          <!-- Option Label -->
          <q-item-label>{{ translate ? $t(props.opt.label) : props.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useComposables } from 'src/scripts/util/composables';
import { TSelectionOption } from 'src/scripts/config/options';
import { QSelect } from 'quasar';

// Composable
const cmp = useComposables();

// Select reference
const select = ref<QSelect | null>(null);

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: any;
  // Selection Options
  options: TSelectionOption<any>[];
  // Label of this component
  label?: string;
  // Icon of this component
  icon?: string;
  // Size of the icon in an option
  optionIconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Flag controlling whether this component has no borders
  borderless?: boolean;
  // Flag controlling whether the icon section should be visible
  showIcons?: boolean;
  // Flag controlling whether the label must be translated
  translate?: boolean;
  // Auto complete attribute
  autoComplete?: string;
  // Flag controlling whether this component is readonly
  readonly?: boolean
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

// Computed label for current selection
const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === modelValue.value);
  return option ? (props.translate ? cmp.i18n.t(option.label) : option.label) : '';
});

// Computed icon for current selection
const selectedIcon = computed(() => {
  const option = props.options.find(opt => opt.value === modelValue.value);
  return option ? option.icon : undefined;
});

/**
 * Shows the popup for the select component.
 *
 * @return {void}
 */
function showPopup(): void {
  select.value.showPopup();
}

// Exposed functions
defineExpose({ showPopup });

</script>
