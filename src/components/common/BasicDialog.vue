<template>
  <!-- Dialog -->
  <q-dialog :model-value="visibility"
            persistent
            @before-show="emit('beforeShow')">
    <!-- Dialog Frame -->
    <div class="dialog-frame"
         :style="width ? { width: `${width}px`} : { width: '600px'}">

      <!-- Title Row -->
      <div class="row">
        <!-- Title Column -->
        <div class="col dialog-title">{{ title }}</div>
      </div>

      <!-- Message Row -->
      <div class="row" style="padding: 16px 0">
        <!-- Message Column -->
        <div class="col">{{ message }}</div>
      </div>

      <!-- Content Row -->
      <div class="row">
        <!-- Content Column -->
        <div class="col">
          <!-- Default Slot -->
          <slot />
        </div>
      </div>

      <!-- Dialog Buttons Row -->
      <div class="row">
        <!-- Dialog Buttons Column -->
        <div class="col text-right">
          <!-- Okay Button -->
          <button-push :label="$t('button.okay')"
                       size="sm"
                       flat
                       @click="onSubmit" />
          <!-- Cancel Button -->
          <button-push :label="$t('button.cancel')"
                       color="#808080"
                       size="sm"
                       flat
                       @click="visibility = false" />
        </div>
      </div>

    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonPush from 'components/common/ButtonPush.vue';
import { QDialog, QForm } from 'quasar';

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: boolean;
  // Title of the dialog
  title: string;
  // Message of the dialog
  message: string;
  // The form for validating when 'Okay' is clicked
  form: QForm | null;
  // Submit Handler Function
  submit: () => Promise<boolean>;
  // The width of the dialog
  width?: number;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Before dialog opened
  (event: 'beforeShow'): void;
  // Model value changed
  (event: 'update:modelValue', value: boolean): void;
}>();

// Computed Model Value
const visibility = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

/**
 * This method is called when the "Okay" button is clicked. It first calls the submit handler,
 * and if the submit handler returns true, it closes the dialog by setting the visibility value to false.
 *
 * @returns {Promise<void>} A Promise that resolves when the method has completed its execution.
 */
async function onSubmit(): Promise<void> {
  // Validate the form, if necessary
  if (!props.form || await props.form.validate()) {
    // Call the submit handler
    if (await props.submit()) {
      // Close the dialog
      visibility.value = false;
    }
  }
}

// Exposed functions
defineExpose({ onSubmit });

</script>
