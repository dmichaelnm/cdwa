<template>
  <!-- Layout -->
  <q-layout view="hHh Lpr fFf">

    <!-- Header -->
    <q-header>
      <!-- Header Toolbar -->
      <div class="application-header">
        <!-- Header Toolbar Row -->
        <div class="row q-col-gutter-x-md items-center">
          <!-- Application Title Column -->
          <div class="col-auto application-header-title">{{ $t('application.title') }}</div>
          <!-- Space Column -->
          <div class="col-grow" />
          <!-- Acount Name Column -->
          <div class="col-auto application-header-accountname">{{ cmp.sessionStore.accountDisplayName }}</div>
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

  </q-layout>
</template>

<style lang="scss">
@import "src/css/quasar.variables";

.application-header {
  padding: 8px;
  color: $light-text;
  background-color: $light-background-0;
  box-shadow: 0 5px 10px 0 $light-shadow-0;
}

.body--dark .application-header {
  color: $dark-text;
  background-color: $dark-background-0;
  box-shadow: 0 5px 10px 0 $dark-shadow;
}

.application-header-title {
  font-size: 16pt;
  font-variant: petite-caps;
}

.application-header-accountname {
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
</style>

<script setup lang="ts">
import * as tp from 'src/scripts/util/types';
import * as fs from 'firebase/firestore';
import { version } from 'src/scripts/config/version';
import { computed, onBeforeMount } from 'vue';
import { useComposables } from 'src/scripts/util/composables';
import { getLanguageOptions } from 'src/scripts/config/options';
import { Logging } from 'src/scripts/util/logging';
import { Account } from 'src/scripts/firestore/account';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import ApplicationFooter from 'components/app/ApplicationFooter.vue';
import SocialMedia from 'components/app/SocialMedia.vue';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import MenuItem from 'components/common/MenuItem.vue';

// Get main composable instances
const cmp = useComposables();

// Computed UI mode
const uiMode = computed(() => {
  return cmp.quasar.dark.isActive
    ? { label: cmp.i18n.t('menu.lightMode'), icon: 'light_mode' }
    : { label: cmp.i18n.t('menu.darkMode'), icon: 'dark_mode' };
});


/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('MainLayout#onBeforeMount');

  // Lock the screen
  cmp.quasar.loading.show({ delay: 0 });

  // Register event listener called when the account has changed
  Account.onAccountStateChange(async (account) => {
    Logging.debug('MainLayout#onAccountStateChange', account);

    if (account === null) {
      // If the account is null, redirect to login page
      await cmp.router.push({ path: 'auth/login' });
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
    }

    // Unlock the screen
    cmp.quasar.loading.hide();
  });
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
 * Logs out the current account.
 *
 * @return {void} - This method does not return a value.
 */
function logout(): void {
  // Reset the session
  cmp.sessionStore.reset();
  // Logout the current account
  Account.logout();
}

</script>
