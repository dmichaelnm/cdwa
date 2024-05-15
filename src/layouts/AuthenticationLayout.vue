<template>
  <!-- Layout -->
  <q-layout view="lHh Lpr lFf">

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
</script>
