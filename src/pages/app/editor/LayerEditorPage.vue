<template>
  <!-- Editor Page -->
  <editor-page ref="editor"
               :type="EDocumentType.layer"
               :form="form"
               :apply="applyValues"
               :create="create"
               :update="update">
    <q-form ref="form"
            @submit="editor?.save()">
      <!-- Hidden submit button -->
      <input type="submit" class="hidden" />
      <!-- Main DIV -->
      <div class="q-col-gutter-y-md">
        <!-- Name & Type Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Name Column -->
          <div class="col-3">
            <!-- Name Input -->
            <field-input v-model="layerName"
                         :label="$t('layer.label.name')"
                         :readonly="mode === tp.EEditorMode.view"
                         mandatory
                         auto-focus />
          </div>
          <!-- Type Column -->
          <div class="col-3">
            <field-select v-model="layerType"
                          :label="$t('layer.label.type')"
                          :options="getLayerTypeOptions()"
                          :readonly="mode !== EEditorMode.create"
                          translate
                          show-icons />
          </div>
        </div>

        <!-- Description Row -->
        <div class="row">
          <!-- Description Column -->
          <div class="col">
            <!-- Description Input -->
            <field-input v-model="layerDescription"
                         :label="$t('label.description')"
                         :readonly="mode === tp.EEditorMode.view"
                         type="textarea" />
          </div>
        </div>

        <!-- Tabs Row -->
        <div class="row">
          <!-- Tabs Column -->
          <div class="col">
            <!-- Tab Definitions -->
            <q-tabs v-model="currentTabName" align="left" no-caps dense>
              <!-- Custom Attributes Tab Definition -->
              <q-tab name="attributes" :label="$t('label.customAttributes')" />
              <!-- Connection Details -->
              <q-tab name="details" :label="$t('label.details')" v-if="mode !== tp.EEditorMode.create" />
            </q-tabs>
            <!-- Tab Panels -->
            <q-tab-panels v-model="currentTabName" keep-alive>
              <!-- Custom Attributes Tab Panel -->
              <q-tab-panel name="attributes">
                <!-- Custom Attributes Table -->
                <custom-attributes-table :attributes="layerAttributes"
                                         :readonly="mode === tp.EEditorMode.view" />
              </q-tab-panel>
              <!-- Connection Details -->
              <q-tab-panel name="details">
                <document-details :data="layerDetails as TDocumentMetaData" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

      </div>
    </q-form>
  </editor-page>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import EditorPage from 'components/app/EditorPage.vue';
import { EDocumentType, EEditorMode, TDocumentAttribute } from 'src/scripts/util/types';
import { QForm } from 'quasar';
import { ref } from 'vue';
import { FirestoreDocument, TDocumentMetaData } from 'src/scripts/firestore/firestore-document';
import { ELayerType, getLayerTypeOptions, ILayerData, Layer } from 'src/scripts/firestore/layer';
import * as tp from 'src/scripts/util/types';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import DocumentDetails from 'components/app/DocumentDetails.vue';
import CustomAttributesTable from 'components/app/CustomAttributesTable.vue';
import { copyAttributes } from 'src/scripts/util/utilities';
import { Project } from 'src/scripts/firestore/project';
import { ProjectDocument } from 'src/scripts/firestore/project-document';

// Composable
const cmp = useComposables();

// Editor reference
const editor = ref<typeof EditorPage | null>(null);
// Form reference
const form = ref<QForm | null>(null);

// Editor Mode
const mode = cmp.sessionStore.queryParams.mode as EEditorMode;
// Current tab name
const currentTabName = ref('attributes');

// Layer Name
const layerName = ref('');
// Layer Description
const layerDescription = ref<string | null>(null);
// Layer Type
const layerType = ref<ELayerType>(ELayerType.fileStorage);
// Custom Attributes
const layerAttributes = ref<TDocumentAttribute[]>([]);
// Details
const layerDetails = ref<TDocumentMetaData | null>(null);

/**
 * Applies values to form fields based on the given editor mode and layer ID.
 * If the editor mode is not 'create', the values are retrieved from the active project and applied to the form fields.
 *
 * @param {EEditorMode} mode - The editor mode.
 * @param {string} [id] - The layer ID (optional).
 *
 * @returns {void}
 */
function applyValues(mode: EEditorMode, id?: string): void {
  if (mode !== EEditorMode.create) {
    // Get the active project
    const project = cmp.sessionStore.project;
    if (project) {
      // Get layer
      const layer = project.getDocument<ILayerData, Layer>(EDocumentType.layer, id as string);
      // Apply values
      layerName.value = layer.data.common.name;
      layerDescription.value = layer.data.common.description;
      layerType.value = layer.data.type;
      // Copy custom attributes
      layerAttributes.value = copyAttributes(layer.data.attributes);
      // Set details
      layerDetails.value = layer.data;
    }
  }
}

/**
 * Creates a new layer document and adds it to the active project.
 *
 * @returns {Promise<FirestoreDocument<ILayerData>>} The newly created layer document.
 */
async function create(): Promise<FirestoreDocument<ILayerData>> {
  // Get the active project
  const project = cmp.sessionStore.project as Project;
  // Create layer document
  const layer = await Layer.createLayer(
    project,
    layerName.value,
    layerDescription.value,
    layerType.value,
    layerAttributes.value
  );
  // Add layer to project
  project.addDocument(layer);
  // Return the layer
  return layer;
}

/**
 * Updates a layer document in Firestore with the provided ID.
 *
 * @param {string} id - The ID of the layer document to update.
 *
 * @returns {Promise<FirestoreDocument<ILayerData>>} - A promise that resolves to the updated layer document.
 */
async function update(id: string): Promise<FirestoreDocument<ILayerData>> {
  // Get the active project
  const project = cmp.sessionStore.project as Project;
  // Get layer
  const layer = project.getDocument<ILayerData, Layer>(EDocumentType.layer, id as string);
  // Apply values
  layer.data.common.name = layerName.value;
  layer.data.common.description = layerDescription.value;
  layer.data.type = layerType.value;
  layer.data.attributes = layerAttributes.value;
  // Update layer
  await ProjectDocument.updateDocument(layer);
  // Return updated layer
  return layer;
}

</script>
