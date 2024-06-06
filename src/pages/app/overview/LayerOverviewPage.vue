<template>
  <!-- Overview Page -->
  <overview-page :type="EDocumentType.layer"
                 :delete="deleteLayer"
                 :permission="getPermission"
                 :items="layers"
                 :custom-columns="[{ name: 'type', label: $t('layer.label.type'), align: 'left', headerStyle: 'width: 250px',
                                     field: row => $t(`enum.layer.${row.data.type}`) }]">
    <!-- Template: Diagram Type -->
    <template #body-cell-type="{ props }">
      <!-- Table Cell -->
      <q-td :props="props">
        <div class="flex items-center">
          <!-- Type Icon -->
          <q-icon :name="getLayerTypeOptions().find(l => l.value === props.row.data.type)?.icon"
                  class="layer-type-icon"
                  size="sm"
                  style="padding-right: 8px"/>
          <!-- Type Label -->
          {{ $t(`enum.layer.${props.row.data.type}`) }}
        </div>
      </q-td>
    </template>
  </overview-page>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.layer-type-icon {
  color: $light-text;
}

.body--dark .layer-type-icon {
  color: $dark-text;
}
</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import OverviewPage from 'components/app/OverviewPage.vue';
import { EDocumentType, EEditorMode, EProjectMemberRole } from 'src/scripts/util/types';
import { computed } from 'vue';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { getLayerTypeOptions, ILayerData, Layer } from 'src/scripts/firestore/layer';

// Composable
const cmp = useComposables();

// Array of layers
const layers = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.getLayers() : [];
});

/**
 * Checks the user's permission for the given mode and item in the active project.
 *
 * @param {EEditorMode} mode - The mode to check permission for (create, view, edit, delete).
 *
 * @return {boolean} - Returns true if the user has permission, otherwise false.
 */
function getPermission(mode: EEditorMode): boolean {
  // Get active project
  const project = cmp.sessionStore.project;
  if (project) {
    // Check create permission
    if (mode === EEditorMode.create) {
      // User needs developer or higher role
      return !project.hasRole(EProjectMemberRole.visitor);
    }
    // Check view permission
    if (mode === EEditorMode.view) {
      // User needs visitor role
      return project.hasRole(EProjectMemberRole.visitor);
    }
    // Check edit and delete permission
    if (mode === EEditorMode.edit || mode === EEditorMode.delete) {
      // User needs developer or higher role
      return !project.hasRole(EProjectMemberRole.visitor);
    }
  }
  // No permission
  return false;
}

/**
 * Deletes a layer from the firestore database and removes it from the project.
 *
 * @param {FirestoreDocument<ILayerData>} document - The document representing the layer to be deleted.
 *
 * @returns {Promise<void>} - A promise that resolves when the layer is successfully deleted and removed from the project.
 */
async function deleteLayer(document: FirestoreDocument<ILayerData>): Promise<void> {
  // Cast to layer
  const layer = document as Layer;
  // Delete the layer
  await FirestoreDocument.delete(layer);
  // Remove the layer from the project
  layer.project.removeDocument(layer);
}

</script>
