<template>
  <q-layout view="lHh Lpr lFf">

  </q-layout>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Logging } from 'src/scripts/util/logging';
import { Account } from 'src/scripts/firestore/account';
import { useComposables } from 'src/scripts/util/composables';
import * as fs from 'firebase/firestore';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { EUIMode } from 'src/scripts/util/types';

// Get main composable instances
const cmp = useComposables();

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
      // Update last login timestamp
      account.data.state.lastLogin = fs.Timestamp.now();
      await FirestoreDocument.update(account);
      // Set UI mode
      cmp.quasar.dark.set(account.data.preferences.uiMode === EUIMode.dark);
      // Set UI Language
      cmp.i18n.locale.value = account.data.preferences.uiLanguage;
    }

    // Unlock the screen
    cmp.quasar.loading.hide();
  });
});

</script>
