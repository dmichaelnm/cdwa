<template>
  <!-- Main DIV -->
  <div class="q-col-gutter-y-md">

    <!-- Message Row -->
    <div class="row">
      <!-- Message Column -->
      <div class="col-10">{{ $t(`connection.application.${application}`) }}</div>
    </div>

    <!-- Properties -->
    <slot />

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

<script setup lang="ts">
import ButtonPush from 'components/common/ButtonPush.vue';
import { EConnectionApplication, TConnectionProperties } from 'src/scripts/firestore/connection';
import { useCloudFunctions, useComposables, useMessageDialog, useRunTask } from 'src/scripts/util/composables';

// Composables
const cmp = useComposables();
const runTask = useRunTask();
const { showSuccessDialog, showErrorDialog } = useMessageDialog();
const { cfTestConnection } = useCloudFunctions();

// Defines the properties of this component.
const props = defineProps<{
  // Connection Properties
  properties: TConnectionProperties;
  // Application
  application: EConnectionApplication;
  // Flag controlling whether this component is readonly
  readonly?: boolean;
}>();

/**
 * Tests the connection.
 *
 * This method runs a test task to check the connection using the test function provided.
 * If the test function returns a result with status 'okay', a success dialog with the result message is shown.
 * Otherwise, an error dialog with the error message is shown.
 *
 * @returns {Promise<void>} A Promise that resolves when the connection test is complete.
 */
async function testConnection(): Promise<void> {
  // Start test task
  await runTask(async () => {
    // Call test function
    const result = await cfTestConnection(props.application, props.properties);
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
