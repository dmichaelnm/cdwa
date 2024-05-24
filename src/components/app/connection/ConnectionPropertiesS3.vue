<template>
  <!-- Main DIV -->
  <div class="q-col-gutter-y-md">
    <!-- Properties Row -->
    <div class="row q-col-gutter-x-md">
      <!-- Region Column -->
      <div class="col-3">
        <!-- Region Selection -->
        <field-select v-model="properties.region"
                      :label="$t('connection.label.region')"
                      :options="getAWSRegions()"
                      :readonly="readonly" />
      </div>
      <!-- Bucket Column -->
      <div class="col-3">
        <!-- Bucket Input -->
        <field-input v-model="properties.bucket"
                     :label="$t('connection.label.bucket')"
                     :readonly="readonly"
                     auto-complete="username"
                     mandatory />
      </div>
      <!-- Access Key ID Column -->
      <div class="col-3">
        <!-- Access Key ID Input -->
        <field-input v-model="properties.accessKeyId"
                     :label="$t('connection.label.accessKeyId')"
                     :readonly="readonly"
                     auto-complete="current-password"
                     type="password"
                     mandatory />
      </div>
      <!-- Secret Access Key Column -->
      <div class="col-3">
        <!-- Secret Access Key Input -->
        <field-input v-model="properties.secretAccessKey"
                     :label="$t('connection.label.secretAccessKey')"
                     :readonly="readonly"
                     auto-complete="current-password"
                     type="password"
                     mandatory />
      </div>
    </div>

    <!-- Button Row -->
    <div class="row q-col-gutter-x-md" v-if="!readonly">
      <!-- Button Column -->
      <div class="col text-right">
        <!-- Test Connection Button -->
        <button-push :label="$t('connection.button.test')"
                     @click="testConnection" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { EConnectionApplication, TConnectionPropertiesS3 } from 'src/scripts/firestore/connection';
import { computed } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { getAWSRegions } from 'src/scripts/config/options';
import ButtonPush from 'components/common/ButtonPush.vue';
import { useCloudFunctions, useComposables, useMessageDialog, useRunTask } from 'src/scripts/util/composables';

// Composables
const cmp = useComposables();
const { cfTestConnection } = useCloudFunctions();
const runTask = useRunTask();
const { showSuccessDialog, showErrorDialog } = useMessageDialog();

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: TConnectionPropertiesS3;
  // Flag controlling whether this component is readonly
  readonly?: boolean;
}>();

// Defines the events emitted by this component.
const emit = defineEmits<{
  // Model value changed
  (event: 'update:modelValue', value: TConnectionPropertiesS3): void
}>();

// Properties edited by this component
const properties = computed({
  get: () => props.modelValue,
  set: newValue => emit('update:modelValue', newValue)
});

/**
 * Tests the connection to a AWS S3 Bucket.
 *
 * @returns {Promise<void>} A Promise that resolves when the connection test is complete.
 */
async function testConnection(): Promise<void> {
  // Start test task
  await runTask(async () => {
    // Call test function
    const result = await cfTestConnection(EConnectionApplication.s3, properties.value);
    if (result.status === 'okay') {
      // Show success dialog
      showSuccessDialog(
        cmp.i18n.t('connection.dialog.success.title'),
        cmp.i18n.t('connection.dialog.success.message'),
        result.message
      );
    } else {
      // Show error dialog
      showErrorDialog(
        cmp.i18n.t('connection.dialog.error.title'),
        cmp.i18n.t('connection.dialog.error.message'),
        result.message
      );
    }
  });
}

</script>
