<template>
  <!-- Account Selection Dialog -->
  <account-select-dialog v-model="dialogVisible"
                         :validate="validateProjectMember"
                         @account-selected="addProjectMember" />

  <!-- Editor Page -->
  <editor-page ref="editor"
               :type="tp.EDocumentType.project"
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
                         :readonly="mode === tp.EEditorMode.view"
                         mandatory
                         auto-focus />
          </div>
          <!-- Project Owner Column -->
          <div class="col-3">
            <!-- Project Owner Field -->
            <field-input :model-value="projectOwner ? projectOwner.displayName : null"
                         :label="$t('project.label.owner')"
                         readonly />
          </div>
          <!-- Project Manager Column -->
          <div class="col-3">
            <!-- Project Manager Selector -->
            <field-select-account v-model="managerAccount"
                                  :readonly="!projectManagerEditable"
                                  :label="$t('project.label.manager')"
                                  :validate="validateProjectManager"
                                  @update:modelValue="value => setProjectManager(value)" />
          </div>
        </div>
        <!-- Description Row -->
        <div class="row">
          <!-- Description Column -->
          <div class="col">
            <!-- Description Input -->
            <field-input v-model="projectDescription"
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
              <!-- Members Tab Definition -->
              <q-tab name="members" :label="$t('project.label.members')" />
              <!-- Custom Attributes Tab Definition -->
              <q-tab name="attributes" :label="$t('label.customAttributes')" />
              <!-- Project Details -->
              <q-tab name="details" :label="$t('label.details')" v-if="mode !== tp.EEditorMode.create" />
            </q-tabs>
            <!-- Tab Panels -->
            <q-tab-panels v-model="currentTabName" keep-alive>
              <!-- Members Tab Panel -->
              <q-tab-panel name="members">
                <!-- Members Table -->
                <editable-table :rows="projectMembers"
                                :columns="[{name: 'name', label: $t('project.label.memberName'), align: 'left',
                                            headerStyle: 'width: 300px',
                                            field: row => row.displayName},
                                           {name: 'role', label: $t('project.label.role'), align: 'left',
                                            input: 'select', options: getRoleOptions(), translate: true,
                                            headerStyle: 'width: 200px',
                                            field: row => $t(`enum.role.${row.role}`)} ]"
                                :add="() => { dialogVisible = true }"
                                :message="$t('project.editor.edit.members.message')"
                                :message-empty="$t('project.editor.edit.members.messageEmpty')"
                                :readonly="mode === tp.EEditorMode.view"
                                deletable />
              </q-tab-panel>
              <!-- Custom Attributes Tab Panel -->
              <q-tab-panel name="attributes">
                <!-- Custom Attributes Table -->
                <custom-attributes-table :attributes="projectAttributes"
                                         :readonly="mode === tp.EEditorMode.view" />
              </q-tab-panel>
              <!-- Project Details -->
              <q-tab-panel name="details">
                <document-details :data="projectDetails as TDocumentMetaData" />
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
import { computed, ref } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelectAccount from 'components/app/FieldSelectAccount.vue';
import { Account } from 'src/scripts/firestore/account';
import { QForm } from 'quasar';
import { IProjectData, Project, TProjectMember } from 'src/scripts/firestore/project';
import { FirestoreDocument, TDocumentMetaData } from 'src/scripts/firestore/firestore-document';
import EditableTable from 'components/common/EditableTable.vue';
import AccountSelectDialog from 'components/app/AccountSelectDialog.vue';
import { getRoleOptions } from 'src/scripts/config/options';
import DocumentDetails from 'components/app/DocumentDetails.vue';
import CustomAttributesTable from 'components/app/CustomAttributesTable.vue';

// Composable
const cmp = useComposables();

// Editor reference
const editor = ref<typeof EditorPage | null>(null);
// Form reference
const form = ref<QForm | null>(null);

// Editor mode
const mode = cmp.sessionStore.queryParams.mode as tp.EEditorMode;
// Current tab name
const currentTabName = ref('members');
// Account Selection Dialog visibility
const dialogVisible = ref(false);
// Project Manager Account
const managerAccount = ref<Account | null>(null);

// Project Manager Editable
const projectManagerEditable = computed(() => {
  return cmp.sessionStore.account && cmp.sessionStore.account.id === projectOwner.value?.accountId && mode !== tp.EEditorMode.view;
});

// Project Name
const projectName = ref('');
// Project Owner
const projectOwner = ref<TProjectMember | null>(null);
// Project Manager
const projectManager = ref<TProjectMember | null>(null);
// Project Description
const projectDescription = ref<string | null>(null);
// Project Members
const projectMembers = ref<TProjectMember[]>([]);
// Project Attributes
const projectAttributes = ref<tp.TDocumentAttribute[]>([]);
// Project Details
const projectDetails = ref<TDocumentMetaData | null>(null);

/**
 * Apply values based on the provided editor mode and project ID.
 *
 * @param {EEditorMode} mode - The editor mode (create or edit).
 * @param {string} [projectId] - The project ID (optional, required only when mode is 'edit').
 *
 * @returns {Promise<void>} A promise that resolves when the values have been applied.
 */
async function applyValues(mode: tp.EEditorMode, projectId?: string): Promise<void> {
  if (mode === tp.EEditorMode.create) {
    // Initialize default values
    projectOwner.value = {
      accountId: cmp.sessionStore.account?.id as string,
      displayName: cmp.sessionStore.account?.getName() as string,
      role: tp.EProjectMemberRole.owner
    };
    projectManager.value = {
      accountId: cmp.sessionStore.account?.id as string,
      displayName: cmp.sessionStore.account?.getName() as string,
      role: tp.EProjectMemberRole.manager
    };
  } else {
    // Get project document
    const project = cmp.sessionStore.getProject(projectId as string) as Project;
    // Apply values
    projectName.value = project.data.common.name;
    projectDescription.value = project.data.common.description;
    projectOwner.value = project.getOwner();
    projectManager.value = project.getManager();
    // Copy members array
    projectMembers.value = project.data.members
      .filter(mbr => mbr.role !== tp.EProjectMemberRole.owner && mbr.role !== tp.EProjectMemberRole.manager)
      .map(mbr => {
        return { ...mbr } as TProjectMember;
      });
    // Copy attributes array
    projectAttributes.value = project.data.attributes.map(att => {
      return { ...att } as tp.TDocumentAttribute;
    });
    // Get metadata
    projectDetails.value = project.data as TDocumentMetaData;
  }
  // Set manager account
  managerAccount.value = await Account.loadAccount(projectManager.value.accountId);
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
    createMembersArray(),
    projectAttributes.value
  );
  // Add new project to session store project list
  cmp.sessionStore.projects.push(project);
  // Send global event
  cmp.bus.emit(tp.EGlobalEvent.projectsChanged, {
    mode: tp.EEditorMode.create,
    project: project
  });
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
  const project = cmp.sessionStore.getProject(projectId) as Project;
  // Apply values
  project.data.common.name = projectName.value;
  project.data.common.description = projectDescription.value;
  project.data.members = createMembersArray();
  project.data.attributes = projectAttributes.value;
  // Update the project
  await Project.updateProject(project);
  // Send global event
  cmp.bus.emit(tp.EGlobalEvent.projectsChanged, {
    mode: tp.EEditorMode.edit,
    project: project
  });
}

/**
 * Validates if an account can be a project manager by checking if it is already a project member.
 *
 * @param {Account} account - The account to be validated as a project manager.
 *
 * @returns {string|null} - Returns an error message if the account is already a project member, otherwise returns null.
 */
function validateProjectManager(account: Account): string | null {
  // Account cannot be a project member
  // Account is already a member
  if (projectMembers.value.some(mbr => mbr.accountId === account.id)) {
    return cmp.i18n.t('project.editor.edit.members.error.isMember');
  }
  // Everything is okay
  return null;
}

/**
 * Set the project manager for the project.
 *
 * @param {Account | null} account - The account of the project manager. Pass null to remove the current project manager.
 *
 * @return {void}
 */
function setProjectManager(account: Account | null): void {
  if (account) {
    projectManager.value = {
      accountId: account.id,
      displayName: account.getName(),
      role: tp.EProjectMemberRole.manager
    };
  }
}

/**
 * Validates if the given account can be added as a project member.
 *
 * @param {Account} account - The account to validate.
 *
 * @returns {string | null} - An error message if the account cannot be added, otherwise null.
 */
function validateProjectMember(account: Account): string | null {
  // Account cannot be the owner of the project
  if (account.id === projectOwner.value?.accountId) {
    return cmp.i18n.t('project.editor.edit.members.error.isOwner');
  }
  // Account cannot be the manager of the project
  if (account.id === projectManager.value?.accountId) {
    return cmp.i18n.t('project.editor.edit.members.error.isManager');
  }
  // Account is already a member
  if (projectMembers.value.some(mbr => mbr.accountId === account.id)) {
    return cmp.i18n.t('project.editor.edit.members.error.isMember');
  }
  // Everything is okay
  return null;
}

/**
 * Adds a new project member to the projectMembers array.
 *
 * @param {Account} account - The account of the project member to be added.
 *
 * @return {void}
 */
function addProjectMember(account: Account): void {
  // Add the new project member
  projectMembers.value.push({
    accountId: account.id,
    displayName: account.getName(),
    role: tp.EProjectMemberRole.visitor
  });
}

/**
 * Creates an array of project members including the owner and manager.
 *
 * @returns {TProjectMember[]} The array of project members.
 */
function createMembersArray(): TProjectMember[] {
  return [
    // Include the owner
    projectOwner.value as TProjectMember,
    // include the manager
    projectManager.value as TProjectMember,
    // Include the members
    ...projectMembers.value
  ];
}

</script>
