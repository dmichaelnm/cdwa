<template>
  <!-- Page -->
  <q-page>

  </q-page>
</template>

<style scoped lang="scss">
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/style.css";

</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import { computed, onBeforeMount } from 'vue';

// Composable
const cmp = useComposables();

// Diagrams of the project
const diagram = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.getDiagrams() : [];
});

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  // If there are no diagrams in the project, route to diagram overview
  if (diagram.value.length === 0) {
    cmp.router.push({ path: '/diagram' });
  }
});

</script>
