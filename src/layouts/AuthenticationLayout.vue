<template>
  <!-- Layout -->
  <q-layout view="lHh Lpr lFf">
    <!-- Message Dialog -->
    <message-dialog v-model="messageDialogOptions.visible"
                    :options="messageDialogOptions" />

    <!-- Application Footer -->
    <application-footer>
      <!-- Center Footer -->
      <template #center>
        <!-- Social Media Links -->
        <social-media />
      </template>
    </application-footer>

    <!-- Page Container -->
    <q-page-container>
      <!-- Router View -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import ApplicationFooter from 'components/app/ApplicationFooter.vue';
import SocialMedia from 'components/app/SocialMedia.vue';
import { useMessageDialog } from 'src/scripts/util/composables';
import MessageDialog from 'components/common/MessageDialog.vue';

// Get message dialog composable
const { messageDialogOptions } = useMessageDialog();

</script>
