<template>
  <!-- Overview Page -->
  <overview-page :type="EDocumentType.connection"
                 :permission="getPermission"
                 :delete="deleteConnection"
                 :items="connections"
                 :custom-columns="[{ name: 'application', label: $t('connection.label.application'),
                                     align: 'left', headerStyle: 'width: 250px', sortable: true,
                                     field: row => $t(`enum.application.${row.data.application}`) }]">
    <!-- Template: Application -->
    <template #body-cell-application="{ props }">
      <!-- Table Cell -->
      <q-td :props="props">
        <div class="flex items-center">
          <!-- Application Icon -->
          <q-icon :name="getApplicationIcon(props.row.data.application)" size="sm" style="padding-right: 4px"/>
          <!-- Application Label -->
          {{ $t(`enum.application.${props.row.data.application}`) }}
        </div>
      </q-td>
    </template>
  </overview-page>
</template>

<script setup lang="ts">
import { useComposables, useRunTask } from 'src/scripts/util/composables';
import OverviewPage from 'components/app/OverviewPage.vue';
import { EDocumentType, EEditorMode, EProjectMemberRole } from 'src/scripts/util/types';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { Connection, EConnectionApplication, IConnectionData } from 'src/scripts/firestore/connection';
import { getApplicationOptions } from 'src/scripts/config/options';
import { computed } from 'vue';

// Composable
const cmp = useComposables();
const runTask = useRunTask();

// Array on connections to be displayed in the overview
const connections = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.getConnections() : [];
});

/**
 * Retrieves the icon associated with the given application.
 *
 * @param {EConnectionApplication} application - The application to get the icon for.
 *
 * @return {string | undefined} - The icon URL or `undefined` if no icon is found.
 */
function getApplicationIcon(application: EConnectionApplication): string | undefined {
  // Get the application options
  const options = getApplicationOptions();
  // Find the option and return the icon
  return options.find(opt => opt.value === application)?.icon;
}

/**
 * Determines whether the user has the specified permission mode for the active project.
 *
 * @param {EEditorMode} mode - The permission mode to check. Possible values are "view", "create", "edit", or "delete".
 *
 * @return {boolean} - Returns true if the user has the specified permission mode, otherwise returns false.
 */
function getPermission(mode: EEditorMode): boolean {
  // Get active project
  const project = cmp.sessionStore.project;
  if (project) {
    // Check view permission
    if (mode === EEditorMode.view) {
      return !project.hasRole(EProjectMemberRole.owner, EProjectMemberRole.manager, EProjectMemberRole.maintainer);
    }
    // Check create, edit and delete permission, maintainer role or above is necessary
    if (mode === EEditorMode.create || mode === EEditorMode.edit || mode === EEditorMode.delete) {
      return project.hasRole(EProjectMemberRole.owner, EProjectMemberRole.manager, EProjectMemberRole.maintainer);
    }
  }
  // No permission
  return false;
}

/**
 * Deletes a connection from the active project and Firestore database.
 *
 * @param {FirestoreDocument<IConnectionData>} document - The Firestore document representing the connection to be deleted.
 *
 * @return {Promise<void>} - A Promise that resolves when the deletion is complete.
 */
async function deleteConnection(document: FirestoreDocument<IConnectionData>): Promise<void> {
  // Cast to connection
  const connection = document as Connection;
  // Start deletion task
  await runTask(async () => {
    // Delete the Firestore document
    await FirestoreDocument.delete(connection);
    // Remove connection from the active project
    connection.project.removeDocument(connection);
  });
}

</script>
