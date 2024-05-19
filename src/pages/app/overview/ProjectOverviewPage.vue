<template>
  <!-- Overview Page -->
  <overview-page :type="EDocumentType.project"
                 :permission="getPermission"
                 :delete="deleteProject"
                 :items="cmp.sessionStore.projects"
                 :custom-columns="[{ name: 'owner', label: $t('project.label.owner'), align: 'left', sortable: true,
                                     headerStyle: 'width: 200px', field: row => row.data.owner.displayName},
                                   { name: 'manager', label: $t('project.label.manager'), align: 'left', sortable: true,
                                     headerStyle: 'width: 200px', field: row => row.data.manager.displayName}
                                  ]" />
</template>

<script setup lang="ts">
import { useCloudFunctions, useComposables, useRunTask } from 'src/scripts/util/composables';
import OverviewPage from 'components/app/OverviewPage.vue';
import { EDocumentType, EEditorMode, EGlobalEvent } from 'src/scripts/util/types';
import { IProjectData } from 'src/scripts/firestore/project';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';

// Composable
const cmp = useComposables();
const { cfDeleteProject } = useCloudFunctions();
const runTask = useRunTask();

/**
 * Determines whether the current user has permission to perform the specified action.
 *
 * @param {EEditorMode} mode - The editor mode (create, edit, or delete).
 * @param {FirestoreDocument<IProjectData>} [item] - Optional item on which the action will be performed.
 *
 * @return {boolean} - True if the user has permission, false otherwise.
 */
function getPermission(mode: EEditorMode, item?: FirestoreDocument<IProjectData>): boolean {
  // Get authorized account
  const account = cmp.sessionStore.account;
  if (account) {
    // Check permissions for create
    if (mode === EEditorMode.create) {
      // Every account can create own projects
      return true;
    }
    if (item) {
      // Check permission for edit
      if (mode === EEditorMode.edit) {
        // Only owner and manager can edit a project
        return account.id === item.data.owner.accountId || account.id === item.data.manager.accountId;
      }
      // Check permission for delete
      if (mode === EEditorMode.delete) {
        // Only the owner can delete a project
        return account.id === item.data.owner.accountId;
      }
    }
  }
  // No permission
  return false;
}

/**
 * Deletes a project.
 *
 * @param project - The project to be deleted.
 *
 * @returns A promise that resolves when the project is successfully deleted.
 */
async function deleteProject(project: FirestoreDocument<IProjectData>): Promise<void> {
  await runTask(async () => {
    // Delete the project in Firestore
    await cfDeleteProject(project.id);
    // Remove the project from the projects list
    cmp.sessionStore.removeProject(project.id);
    // Send global event
    cmp.bus.emit(EGlobalEvent.projectsChanged, {
      mode: EEditorMode.delete,
      project: project
    });
  });
}

</script>
