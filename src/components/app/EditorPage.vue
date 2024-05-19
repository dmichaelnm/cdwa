<template>
  <!-- Page Frame -->
  <page-frame :title="$t(`${type}.editor.${mode}.title`)"
              :message="$t(`${type}.editor.${mode}.message`)">
    <!-- Template Buttons -->
    <template #buttons>
      <!-- Save Button -->
      <button-push :label="$t('button.save')"
                   @click="save" />
      <!-- Cancel Button -->
      <button-push :label="$t('button.cancel')"
                   color="#808080"
                   @click="closeEditor" />
    </template>

    <!-- Main DIV -->
    <div class="q-col-gutter-y-md">
      <!-- Default Slot -->
      <slot />
    </div>
  </page-frame>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { useComposables, useRunTask } from 'src/scripts/util/composables';
import { EDocumentType, EEditorMode } from 'src/scripts/util/types';
import PageFrame from 'components/app/PageFrame.vue';
import ButtonPush from 'components/common/ButtonPush.vue';
import { QForm } from 'quasar';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { onBeforeMount } from 'vue';

// Composable
const cmp = useComposables();
const runTask = useRunTask();

// Mode parameter
const mode = cmp.sessionStore.queryParams.mode as EEditorMode;
// Item ID parameter
const itemId = cmp.sessionStore.queryParams.itemId as string | undefined;

// Defines the properties of this component.
const props = defineProps<{
  // Type of document to be edited
  type: EDocumentType
  // Form to be validated on Save action
  form: QForm | null;
  // Apply handler function
  apply: (mode: EEditorMode, id?: string) => Promise<void> | void;
  // Create handler function
  create: () => Promise<FirestoreDocument<any>>;
  // Update handler function
  update: (id: string) => Promise<void>;
}>();

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  // Initialize the values of this editor page
  props.apply(mode, itemId);
});

/**
 * Closes the currently open editor.
 *
 * @return {void}
 */
function closeEditor(): void {
  // Unlock editor
  cmp.sessionStore.editorLock = false;
  // Close the editor and route back to caller
  cmp.router.back();
}

/**
 * Saves the editor by executing the provided create or update methods.
 *
 * @returns {Promise<void>} A promise that resolves when the save operation is complete.
 */
async function save(): Promise<void> {
  // Validate Form
  if (!props.form || await props.form.validate()) {
    // Start task for saving the editor
    await runTask(
      // Task execution
      async () => {
        if (mode === EEditorMode.create) {
          // Create a new document
          await props.create();
        } else if (mode === EEditorMode.edit) {
          // Update the document
          await props.update(itemId as string);
        }
        // Close the editor
        closeEditor();
      }
    );
  }
}

// Exposed functions
defineExpose({ save });

</script>
