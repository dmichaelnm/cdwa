<template>
  <!-- Layout -->
  <q-layout view="hHh Lpr fFf">
    <!-- Message Dialog -->
    <message-dialog v-model="messageDialogOptions.visible"
                    :options="messageDialogOptions" />

    <!-- Header -->
    <q-header>
      <!-- Header Toolbar -->
      <div class="application-header">
        <!-- Header Toolbar Row -->
        <div class="row q-col-gutter-x-md items-center">
          <!-- Application Title Column -->
          <div class="col-auto application-header-title">{{ $t('application.title') }}</div>
          <!-- Project Overview Column -->
          <div class="col-auto" v-if="hasProject">
            <!-- Project Overview Button -->
            <button-icon size="md" icon="mdi-home-outline" @click="to('/project')"
                         :tooltip="$t('project.overview.title')" />
          </div>
          <!-- Active Project Selection Column -->
          <div class="col-auto" v-if="hasProject">
            <!-- Active Project Selection -->
            <field-select v-model="activeProjectId"
                          :options="projectOptions"
                          class="active-project-selector"
                          @update:modelValue="value => switchProject(value)" />
          </div>
          <!-- Space Column -->
          <div class="col-grow" />
          <!-- Acount Name Column -->
          <div class="col-auto application-header-accountname">
            <div>{{ cmp.sessionStore.accountDisplayName }}</div>
            <div>{{ cmp.sessionStore.project ? $t(`enum.role.${cmp.sessionStore.project.getOwnRole()}`) : '' }}</div>
          </div>
          <!-- Account Menu Column -->
          <div class="col-auto">
            <!-- Account Menu Button -->
            <button-icon size="md" icon="person">
              <!-- Menu -->
              <q-menu class="application-header-accountmenu">
                <!-- List -->
                <q-list>
                  <!-- UI Mode Menu Item -->
                  <menu-item :label="uiMode.label"
                             :icon="uiMode.icon"
                             clickable closable show-icon
                             @click="switchUIMode" />
                  <!-- UI Language Menu Item -->
                  <menu-item :label="$t('menu.language')"
                             icon="language"
                             clickable show-icon>
                    <!-- Language Sub Menu -->
                    <q-menu anchor="top left" self="top right">
                      <!-- LIst -->
                      <q-list>
                        <!-- Language Menu Items -->
                        <menu-item v-for="lng in getLanguageOptions()"
                                   :key="lng.value"
                                   :label="$t(lng.label)"
                                   :icon="lng.icon"
                                   clickable closable show-icon
                                   @click="switchUILanguage(lng.value)" />
                      </q-list>
                    </q-menu>
                  </menu-item>
                  <!-- Separator -->
                  <q-separator />
                  <!-- Logout Menu Item -->
                  <menu-item :label="$t('menu.logout')"
                             icon="logout"
                             clickable closable show-icon
                             @click="logout" />
                </q-list>
              </q-menu>
            </button-icon>
          </div>
        </div>
      </div>
    </q-header>

    <!-- Footer -->
    <application-footer>
      <!-- Left Footer: Copyright -->
      <template #left>
        <!-- Copyright Notice -->
        <div class="application-footer-hint" v-html="$t('application.copyright')" />
      </template>
      <!-- Center Footer: Social Media -->
      <template #center>
        <!-- Social Media -->
        <social-media />
      </template>
      <!-- Right Footer: Version -->
      <template #right>
        <!-- Version Information -->
        <div class="application-footer-hint">
          {{ $t('application.version', {
          major: version.major,
          minor: version.minor,
          patch: version.patch,
          env: version.environment,
          build: version.build
        }) }}
        </div>
      </template>
    </application-footer>

    <!-- Page Container -->
    <q-page-container>
      <!-- Router View -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style lang="scss">
@import "src/css/quasar.variables";

.application-header {
  padding: 8px;
  color: $light-text;
  background-color: $light-background-0;
}

.body--dark .application-header {
  color: $dark-text;
  background-color: $dark-background-0;
}

.application-header-title {
  padding-right: 32px;
  font-size: 16pt;
  font-variant: petite-caps;
}

.application-header-accountname {
  text-align: right;
  font-size: 9pt;
  font-variant: petite-caps;
}

.application-header-accountmenu {
  width: 200px;
}

.application-footer-hint {
  font-size: 8pt;
  padding: 0 8px;
  color: $light-text-hint;
}

.body--dark .application-footer-hint {
  color: $dark-text-hint;
}

.active-project-selector {
  width: 250px;
  border-radius: 4px;
}

.toolbox {
  background-color: $light-background-0;
  box-shadow: -10px 0 10px -11px $light-shadow-0;
}

.body--dark .toolbox {
  background-color: $dark-background-0;
  box-shadow: -10px 0 10px -11px $dark-shadow;
}
</style>

<script setup lang="ts">
import * as tp from 'src/scripts/util/types';
import * as fs from 'firebase/firestore';
import { version } from 'src/scripts/config/version';
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useComposables, useMessageDialog, useRouting, useRunTask } from 'src/scripts/util/composables';
import { getLanguageOptions, TSelectionOption } from 'src/scripts/config/options';
import { Logging } from 'src/scripts/util/logging';
import { Account } from 'src/scripts/firestore/account';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import ApplicationFooter from 'components/app/ApplicationFooter.vue';
import SocialMedia from 'components/app/SocialMedia.vue';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import MenuItem from 'components/common/MenuItem.vue';
import { Project } from 'src/scripts/firestore/project';
import MessageDialog from 'components/common/MessageDialog.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { Diagram, IDiagramData } from 'src/scripts/firestore/diagram';

// Get main composable instances
const cmp = useComposables();
const runTask = useRunTask();
const { messageDialogOptions, showConfirmationDialog } = useMessageDialog();
const { to } = useRouting();

// Computed UI mode
const uiMode = computed(() => {
  return cmp.quasar.dark.isActive
    ? { label: cmp.i18n.t('menu.lightMode'), icon: 'light_mode' }
    : { label: cmp.i18n.t('menu.darkMode'), icon: 'dark_mode' };
});

// Computed project options for active project selection
const projectOptions = computed<TSelectionOption<string>[]>(() => {
  return cmp.sessionStore.projects.map(prj => {
    return {
      value: prj.id,
      label: prj.getName()
    };
  });
});

// Flag controlling whether project related controls are shown
const hasProject = computed(() => {
  return activeProjectId.value !== null;
});

// Current ID of active project
const activeProjectId = ref<string | null>(null);

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('MainLayout#onBeforeMount');

  // Lock the screen
  cmp.quasar.loading.show({ delay: 0 });

  // Register event listener for changes in the projects array of the session store
  cmp.bus.on(tp.EGlobalEvent.projectsChanged, (event: { mode: tp.EEditorMode, document: FirestoreDocument<any> }) => {
    Logging.debug('projectsChanged', event);
    if (event.mode === tp.EEditorMode.delete) {
      // Check if deleted project is the active project
      if (event.document.id === activeProjectId.value) {
        // Switch to another project
        switchProject(null);
      }
    } else if (event.mode === tp.EEditorMode.create) {
      // If there is no active project, make the new project to active project
      if (activeProjectId.value === null) {
        // Switch to new project
        switchProject(event.document.id);
      }
    }
  });

  // Register event listener called when the account has changed
  Account.onAccountStateChange(async (account) => {
    Logging.debug('MainLayout#onAccountStateChange', account);

    if (account === null) {
      // If the account is null, redirect to login page
      await cmp.router.push({ path: '/auth/login' });
    } else {
      // Store account on session
      cmp.sessionStore.account = account;
      // Update last login timestamp
      account.data.state.lastLogin = fs.Timestamp.now();
      await FirestoreDocument.update(account);
      // Set UI mode
      cmp.quasar.dark.set(account.data.preferences.uiMode === tp.EUIMode.dark);
      // Set UI Language
      cmp.i18n.locale.value = account.data.preferences.uiLanguage;
      // Load all projects of the user
      cmp.sessionStore.projects = await Project.loadProjects();
      // Switch to current project
      await switchProject(account.data.state.activeProject);
    }
    // Unlock the screen
    cmp.quasar.loading.hide();
  });
});

/**
 * Lifecycle event method called before this component is unmounted.
 */
onBeforeUnmount(() => {
  Logging.debug('MainLayout#onBeforeUnmount');
  // Deregister event listeners
  cmp.bus.off(tp.EGlobalEvent.projectsChanged);
});

/**
 * Switches the UI mode between dark and light.
 *
 * @return {void} - This method does not return a value.
 */
function switchUIMode(): void {
  // Switch the UI mode
  cmp.quasar.dark.set(!cmp.quasar.dark.isActive);
  // Get UI mode
  const uiMode = cmp.quasar.dark.isActive ? tp.EUIMode.dark : tp.EUIMode.light;
  // Update account with new preference
  cmp.sessionStore.accountActive.data.preferences.uiMode = uiMode;
  Account.update(cmp.sessionStore.accountActive);
  // Set the cookie
  cmp.quasar.cookies.set(tp.ECookie.uiMode, uiMode, { expires: 365 });
}

/**
 * Changes the UI language in the application.
 *
 * @param {EUILanguage} languageCode - The language code to switch to.
 *
 * @return {void} - This method does not return a value.
 */
function switchUILanguage(languageCode: tp.EUILanguage): void {
  // Switch the UI language
  cmp.i18n.locale.value = languageCode;
  // Update account with new preference
  cmp.sessionStore.accountActive.data.preferences.uiLanguage = languageCode;
  Account.update(cmp.sessionStore.accountActive);
  // Set the cookie
  cmp.quasar.cookies.set(tp.ECookie.uiLanguage, languageCode, { expires: 365 });
}

/**
 * Switches the active project to the specified project ID.
 *
 * @param {string | null} projectId - The ID of the project to switch to. If null, the first project in the list of
 *                                    visible projects will be chosen.
 *
 * @returns {Promise<void>} - A Promise that resolves when the project has been switched.
 */
async function switchProject(projectId: string | null): Promise<void> {
  // Check editor mode
  if (cmp.sessionStore.editorLock) {
    // Reset active project ID
    activeProjectId.value = cmp.sessionStore.project?.id as string;
    // Show confirm dialog for discard changes
    showConfirmationDialog(
      cmp.i18n.t('dialog.discard.title'),
      cmp.i18n.t('dialog.discard.message'),
      undefined,
      async (value) => {
        // Check confirmation
        if (value === 'okay') {
          // Reset editor lock
          cmp.sessionStore.editorLock = false;
          // Switch project
          await switchProject(projectId);
          // Route to main page
          await to('/');
        }
      }
    );
  } else {
    await runTask(async () => {
      // Check, if projectId exists in the list of visible projects
      if (cmp.sessionStore.getProject(projectId) === null) {
        // Invalid project ID, take first project in the list
        projectId = cmp.sessionStore.projects.length > 0
          ? cmp.sessionStore.projects[0].id
          : null;
      }
      // Set active project ID
      activeProjectId.value = projectId;
      // If project ID is not null, load the project
      if (projectId !== null) {
        cmp.sessionStore.project = await Project.loadProject(projectId);
      } else {
        cmp.sessionStore.project = null;
      }
      // Update the session with the new project ID
      cmp.sessionStore.accountActive.data.state.activeProject = projectId;
      await FirestoreDocument.update(cmp.sessionStore.accountActive);
      // Route the target page
      if (cmp.sessionStore.projects.length === 0) {
        // If there are no projects, route to project overview page
        await cmp.router.push({ path: '/project' });
      } else if (cmp.sessionStore.project?.getDiagrams().length === 0) {
        // If there are no diagrams in the project, route to diagrams overview
        await cmp.router.push({ path: '/diagram' });
      } else {
        // Route to modeling page
        await cmp.router.push({ path: '/' });
      }
    });
  }
}

/**
 * Logs out the current user and resets the session.
 *
 * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
 */
async function logout(): Promise<void> {
  // Save current diagram
  const diagram = cmp.sessionStore.project && cmp.sessionStore.currentDiagramId
    ? cmp.sessionStore.project.getDocument<IDiagramData, Diagram>(tp.EDocumentType.diagram, cmp.sessionStore.currentDiagramId)
    : undefined;
  if (diagram) {
    await Diagram.updateDocument(diagram);
  }
  // Reset the session
  cmp.sessionStore.reset();
  // Logout the current account
  await Account.logout();
}

</script>
