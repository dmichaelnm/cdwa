<template>
  <!-- Overview Page -->
  <overview-page :type="EDocumentType.project"
                 :permission="getPermission"
                 :items="cmp.sessionStore.projects"
                 :custom-columns="[{ name: 'owner', label: $t('project.label.owner'), align: 'left', sortable: true,
                                     headerStyle: 'width: 200px', field: row => row.data.owner.displayName},
                                   { name: 'manager', label: $t('project.label.manager'), align: 'left', sortable: true,
                                     headerStyle: 'width: 200px', field: row => row.data.manager.displayName}
                                  ]" />
</template>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import OverviewPage from 'components/app/OverviewPage.vue';
import { EDocumentType, EEditorMode } from 'src/scripts/util/types';
import { IProjectData } from 'src/scripts/firestore/project';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';

// Composable
const cmp = useComposables();

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

</script>
