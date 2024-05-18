<template>
  <!-- Editor Page -->
  <editor-page ref="editor"
               :type="EDocumentType.project"
               :form="form"
               :apply="applyValues"
               :create="createProject"
               :update="updateProject">
    <!-- Form -->
    <q-form ref="form"
            @submit="editor?.save()">
      <!-- Hidden submit button -->
      <input type="submit" class="hidden" />
      <!-- Main DIV -->
      <div class="q-col-gutter-y-md">
        <!-- Name & Project Manager Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Name Column -->
          <div class="col-3">
            <!-- Name Input -->
            <field-input v-model="projectName"
                         :label="$t('project.label.name')"
                         mandatory
                         auto-focus />
          </div>
          <!-- Project Owner Column -->
          <div class="col-3">
            <!-- Project Owner Field -->
            <field-input :model-value="projectOwner ? projectOwner.getName() : null"
                         :label="$t('project.label.owner')"
                         readonly />
          </div>
          <!-- Project Manager Column -->
          <div class="col-3">
            <!-- Project Manager Selector -->
            <field-select-account v-model="projectManager"
                                  :label="$t('project.label.manager')" />
          </div>
        </div>
        <!-- Description Row -->
        <div class="row">
          <!-- Description Column -->
          <div class="col">
            <!-- Description Input -->
            <field-input v-model="projectDescription"
                         :label="$t('label.description')"
                         type="textarea" />
          </div>
        </div>
      </div>
    </q-form>
  </editor-page>
</template>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import EditorPage from 'components/app/EditorPage.vue';
import { EDocumentType, EEditorMode } from 'src/scripts/util/types';
import { ref } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelectAccount from 'components/app/FieldSelectAccount.vue';
import { Account } from 'src/scripts/firestore/account';
import { QForm } from 'quasar';
import { IProjectData, Project } from 'src/scripts/firestore/project';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';

// Composable
const cmp = useComposables();

// Editor reference
const editor = ref<typeof EditorPage | null>(null);
// Form reference
const form = ref<QForm | null>(null);

// Project Name
const projectName = ref('');
// Project Owner Account
const projectOwner = ref<Account | null>(null);
// Project Manager Account
const projectManager = ref<Account | null>(null);
// Project Description
const projectDescription = ref<string | null>(null);

/**
 * Apply values based on the provided editor mode and project ID.
 *
 * @param {EEditorMode} mode - The editor mode (create or edit).
 * @param {string} [projectId] - The project ID (optional, required only when mode is 'edit').
 *
 * @returns {Promise<void>} A promise that resolves when the values have been applied.
 */
async function applyValues(mode: EEditorMode, projectId?: string): Promise<void> {
  if (mode === EEditorMode.create) {
    // Initialize default values
    projectOwner.value = cmp.sessionStore.account;
    projectManager.value = cmp.sessionStore.account;
  } else if (mode === EEditorMode.edit) {
    // Get project document
    const project = cmp.sessionStore.getProject(projectId as string);
    // Apply values
    projectName.value = project.data.common.name;
    projectDescription.value = project.data.common.description;
    projectOwner.value = await Account.loadAccount(project.data.owner.accountId);
    projectManager.value = await Account.loadAccount(project.data.manager.accountId);
  }
}

/**
 * Creates a new project.
 *
 * @return {Promise<void>} A promise that resolves when the project is created successfully.
 */
async function createProject(): Promise<FirestoreDocument<IProjectData>> {
  // Create and return the new project
  const project = await Project.createProject(
    projectName.value,
    projectDescription.value,
    projectOwner.value as Account,
    projectManager.value as Account,
    [],
    cmp.i18n.t('role.default.name'),
    cmp.i18n.t('role.default.description')
  );
  // Add new project to session store project list
  cmp.sessionStore.projects.push(project);
  // Return the new project
  return project;
}

/**
 * Updates a project with the specified projectId with the values from the form fields.
 *
 * @param {string} projectId - The id of the project to update.
 *
 * @returns {Promise} - A promise that resolves with no value upon successful project update.
 */
async function updateProject(projectId: string): Promise<void> {
  // Get the project
  const project = cmp.sessionStore.getProject(projectId);
  // Apply values
  project.data.common.name = projectName.value;
  project.data.common.description = projectDescription.value;
  project.data.manager = {
    accountId: projectManager.value?.id as string,
    displayName: projectManager.value?.getName() as string
  };
  // Update the project
  await Project.updateProject(project);
}

</script>
