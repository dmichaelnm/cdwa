<template>
  <q-layout view="lHh Lpr lFf">

  </q-layout>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Logging } from 'src/scripts/util/logging';
import { Account } from 'src/scripts/firestore/account';
import { useComposables } from 'src/scripts/util/composables';

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
  Account.onAccountStateChange(account => {
    Logging.debug('MainLayout#onAccountStateChange', account);
    // If the account is null, redirect to login page
    if (account === null) {
      cmp.router.push({ path: 'auth/login' });
    }

    // Unlock the screen
    cmp.quasar.loading.hide();
  });
});

</script>
