<template>
  <!-- Dialog -->
  <q-dialog ref="dialog"
            :model-value="modelValue"
            persistent
            @update:modelValue="value => modelValue = value">
    <!-- Dialog Frame -->
    <div class="dialog-frame q-col-gutter-y-md">

      <!-- Dialog Title Row -->
      <div class="row">
        <!-- Dialog Title Column -->
        <div class="col dialog-title">{{ options.title }}</div>
      </div>

      <!-- Dialog Marker Row -->
      <div class="row" v-if="options.color">
        <!-- Dialog Marker Column -->
        <div class="col dialog-marker"
             :style="{ 'background-color': options.color }" />
      </div>

      <!-- Dialog Message Row -->
      <div class="row">
        <!-- Dialog Message Column -->
        <div class="col">{{ options.message }}</div>
      </div>

      <!-- Dialog Details Row -->
      <div class="row" v-if="options.details">
        <!-- Dialog Details Column -->
        <div class="col dialog-details"><span v-html="options.details" /></div>
      </div>

      <!-- Dialog Buttons Row -->
      <div class="row">
        <!-- Dialog Buttons Column -->
        <div class="col text-right">
          <!-- Dialog Buttons -->
          <button-push v-for="btn in dialogButtons"
                       :key="btn"
                       :label="$t('button.' + btn)"
                       flat
                       size="sm"
                       @click="closeDialog(btn)" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.dialog-marker {
  height: 4px;
}

.dialog-details {
  font-size: 8pt;
  color: $light-text-hint;
}

.body--dark .dialog-details {
  color: $dark-text-hint;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { TMessageDialogOptions } from 'src/scripts/util/types';
import ButtonPush from 'components/common/ButtonPush.vue';

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: boolean;
  // Dialog Title
  options: TMessageDialogOptions;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Model value change event
  (event: 'update:modelValue', value: boolean): void;
}>();

// Computed model value
const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

// Computed dialog buttons
const dialogButtons = computed(() => {
  return props.options.buttons ? props.options.buttons : ['close'];
});

/**
 * Closes the dialog and optionally calls the specified callback.
 *
 * @param {string} value - The value to pass to the callback function.
 *
 * @return {void}
 */
function closeDialog(value: string): void {
  let close = true;
  // Call the callback if specified in the options
  if (props.options.callback) {
    const result = props.options.callback(value);
    close = typeof result === 'boolean' ? result as boolean : true;
  }
  // Close dialog if necessary
  if (close) {
    modelValue.value = false;
  }
}

</script>
