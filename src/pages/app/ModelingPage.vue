<template>
  <!-- Page -->
  <q-page>
    <!-- Diagram Tab Definitions -->
    <q-tabs v-model="cmp.sessionStore.currentDiagramId"
            align="left"
            no-caps dense inline-label>
      <!-- Diagram Tab -->
      <q-tab v-for="diagram in diagrams"
             :name="diagram.id"
             :key="diagram.id"
             :label="diagram.getName()"
             :icon="getDiagramTypeIcon(diagram.data.type)" />
    </q-tabs>
    <div style="height: calc(100vh - 132px)">
      <!-- Vue Flow -->
      <VueFlow snap-to-grid
               :snap-grid="[20, 20]">
        <!-- Background -->
        <Background :gap="20" />

      </VueFlow>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/style.css";

</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import { computed, onBeforeMount } from 'vue';
import { getDiagramTypeIcon } from 'src/scripts/util/utilities';
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Logging } from 'src/scripts/util/logging';
import { EDocumentType } from 'src/scripts/util/types';

// Composable
const cmp = useComposables();

// Diagrams of the current project
const diagrams = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.getDiagrams() : [];
});

// Current diagram
const diagram = computed(() => {
  return cmp.sessionStore.project && cmp.sessionStore.currentDiagramId
    ? cmp.sessionStore.project.getDocument(EDocumentType.diagram, cmp.sessionStore.currentDiagramId)
    : undefined;
});

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('ModelingPage#onBeforeMount');
  // If there are no diagrams in the project, route to diagram overview
  if (diagrams.value.length === 0) {
    cmp.router.push({ path: '/diagram' });
  }
  // Set current diagram, if not yet set
  if (cmp.sessionStore.currentDiagramId === null && diagrams.value.length > 0) {
    cmp.sessionStore.currentDiagramId = diagrams.value[0].id;
  }
});

</script>
