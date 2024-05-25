<template>
  <!-- Overview Page -->
  <overview-page :type="EDocumentType.diagram"
                 :items="diagrams"
                 :permission="getPermission"
                 :delete="deleteDiagram"
                 :custom-columns="[{ name: 'type', label: $t('diagram.label.type'), align: 'left',
                                     headerStyle: 'width: 250px', sortable: true,
                                     field: row => $t(`enum.diagram.${row.data.type}`) }]">
    <!-- Template: Diagram Type -->
    <template #body-cell-type="{ props }">
      <!-- Table Cell -->
      <q-td :props="props">
        <div class="flex items-center">
          <!-- Type Icon -->
          <q-icon :name="getDiagramTypeIcon(props.row.data.type)"
                  class="diagram-type-icon"
                  size="sm"
                  style="padding-right: 4px"/>
          <!-- Type Label -->
          {{ $t(`enum.diagram.${props.row.data.type}`) }}
        </div>
      </q-td>
    </template>
  </overview-page>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.diagram-type-icon {
  color: $light-text;
}

.body--dark .diagram-type-icon {
  color: $dark-text;
}
</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import OverviewPage from 'components/app/OverviewPage.vue';
import { EDocumentType, EEditorMode, EProjectMemberRole } from 'src/scripts/util/types';
import { computed } from 'vue';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { Diagram, EDiagramType, IDiagramData } from 'src/scripts/firestore/diagram';
import { getDiagramTypeOptions } from 'src/scripts/config/options';

// Composable
const cmp = useComposables();

// Array on diagrams to be displayed in the overview
const diagrams = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.getDiagrams() : [];
});

/**
 * Retrieves the icon associated with a given diagram type.
 *
 * @param {EDiagramType} type - The diagram type.
 *
 * @return {string | undefined} - The icon associated with the diagram type, or undefined if not found.
 */
function getDiagramTypeIcon(type: EDiagramType): string | undefined {
  // Get diagram option for type
  const option = getDiagramTypeOptions().find(opt => opt.value === type);
  // Return the icon
  return option?.icon;
}

/**
 * Retrieves the permission level based on the provided editor mode.
 *
 * @param {EEditorMode} mode - The mode of the editor (e.g., view, create, edit, delete).
 *
 * @return {boolean} - True if the current user has the required permission, otherwise false.
 */
function getPermission(mode: EEditorMode): boolean {
  // Get active project
  const project = cmp.sessionStore.project;
  if (project) {
    // Check view permission
    if (mode === EEditorMode.view) {
      return project.hasRole(EProjectMemberRole.visitor);
    }
    // To create, edit or delete a diagram the role "Developer" or higher is needed.
    if (mode === EEditorMode.create || mode === EEditorMode.edit || mode === EEditorMode.delete) {
      return !project.hasRole(EProjectMemberRole.visitor);
    }
  }
  // No permission
  return false;
}

/**
 * Deletes a diagram document.
 *
 * @param {FirestoreDocument<IDiagramData>} document - The document to be deleted.
 *
 * @returns {Promise<void>} - A Promise that resolves once the document is deleted.
 */
async function deleteDiagram(document: FirestoreDocument<IDiagramData>): Promise<void> {
  // Cast to diagram
  const diagram = document as Diagram;
  // Delete the diagram document
  await FirestoreDocument.delete(diagram);
  // Remove diagram from project
  diagram.project.removeDocument(diagram);
}

</script>
