<template>
  <!-- Editor Page -->
  <editor-page ref="editor"
               :type="EDocumentType.diagram"
               :form="form"
               :apply="applyValues"
               :create="createDiagram"
               :update="updateDiagram">
    <!-- Form -->
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
            <field-input v-model="diagramName"
                         :label="$t('diagram.label.name')"
                         :readonly="mode === tp.EEditorMode.view"
                         mandatory
                         auto-focus />
          </div>
          <!-- Type Column -->
          <div class="col-3">
            <!-- Type Selection -->
            <field-select v-model="diagramType"
                          :label="$t('diagram.label.type')"
                          :options="getDiagramTypeOptions()"
                          :readonly="mode !== tp.EEditorMode.create"
                          translate
                          show-icons />
          </div>
        </div>

        <!-- Description Row -->
        <div class="row">
          <!-- Description Column -->
          <div class="col">
            <!-- Description Input -->
            <field-input v-model="diagramDescription"
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
              <!-- Diagram Details -->
              <q-tab name="details" :label="$t('label.details')" v-if="mode !== tp.EEditorMode.create" />
            </q-tabs>
            <!-- Tab Panels -->
            <q-tab-panels v-model="currentTabName" keep-alive>
              <!-- Diagram Details -->
              <q-tab-panel name="details" v-if="mode !== tp.EEditorMode.create">
                <document-details :data="diagramDetails as TDocumentMetaData" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

      </div>
    </q-form>
  </editor-page>
</template>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import EditorPage from 'components/app/EditorPage.vue';
import * as tp from 'src/scripts/util/types';
import { EDocumentType, EEditorMode } from 'src/scripts/util/types';
import { QForm } from 'quasar';
import { ref } from 'vue';
import { FirestoreDocument, TDocumentMetaData } from 'src/scripts/firestore/firestore-document';
import { Diagram, EDiagramType, IDiagramData } from 'src/scripts/firestore/diagram';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { getDiagramTypeOptions } from 'src/scripts/config/options';
import { Project } from 'src/scripts/firestore/project';
import DocumentDetails from 'components/app/DocumentDetails.vue';
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
const currentTabName = ref('details');

// Name of the diagram
const diagramName = ref('');
// Type of the diagram
const diagramType = ref(EDiagramType.architecture);
// Description of the diagram
const diagramDescription = ref<string | null>(null);
// Diagram Details
const diagramDetails = ref<TDocumentMetaData | null>(null);

/**
 * Applies values to HTML input fields based on the provided editor mode and diagram ID.
 *
 * @param {EEditorMode} mode - The editor mode.
 * @param {string} [id] - Optional diagram ID.
 *
 * @returns {void}
 */
function applyValues(mode: EEditorMode, id?: string): void {
  if (mode !== EEditorMode.create) {
    // Get the active project
    const project = cmp.sessionStore.project as Project;
    if (project) {
      // Get diagram
      const diagram = project.getDocument<IDiagramData, Diagram>(EDocumentType.diagram, id as string);
      // Apply values
      diagramName.value = diagram.data.common.name;
      diagramDescription.value = diagram.data.common.description;
      diagramType.value = diagram.data.type;
      // Get details
      diagramDetails.value = diagram.data;
    }
  }
}

/**
 * Creates a new diagram and adds it to the active project.
 *
 * @returns {Promise<FirestoreDocument<IDiagramData>>} A promise that resolves to the newly created diagram document.
 */
async function createDiagram(): Promise<FirestoreDocument<IDiagramData>> {
  // Get the active project
  const project = cmp.sessionStore.project as Project;
  // Create the diagram document
  const diagram = await Diagram.createDiagram(
    project,
    diagramName.value,
    diagramDescription.value,
    diagramType.value
  );
  // Add diagram to project
  project.addDocument(diagram);
  // Return the diagram
  return diagram;
}

/**
 * Updates a diagram in the Firestore database with the specified ID.
 *
 * @param {string} id - The ID of the diagram to be updated.
 *
 * @returns {Promise<FirestoreDocument<IDiagramData>>} - A promise that resolves to the updated diagram document.
 */
async function updateDiagram(id: string): Promise<FirestoreDocument<IDiagramData>> {
  // Get the active project
  const project = cmp.sessionStore.project as Project;
  // Get diagram
  const diagram = project.getDocument<IDiagramData, Diagram>(EDocumentType.diagram, id);
  // Apply values
  diagram.data.common.name = diagramName.value;
  diagram.data.common.description = diagramDescription.value;
  // Update the document
  await ProjectDocument.updateDocument(diagram);
  // Return the document
  return diagram;
}

</script>
