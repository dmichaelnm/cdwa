<template>
  <!-- Page -->
  <q-page class="page">
    <!-- Splitter -->
    <q-splitter v-model="cmp.sessionStore.splitter">
      <!-- Left Side -->
      <template #before>
        <!-- Project Tree -->
        <project-tree />
      </template>
      <!-- Right Side -->
      <template #after>
        <!-- Diagram Tab Definitions -->
        <q-tabs v-model="cmp.sessionStore.currentDiagramId"
                align="left"
                no-caps dense inline-label
                @update:modelValue="onDiagramSwitched">
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
                   :snap-grid="[20, 20]"
                   @dragover="onDragOver"
                   @drop="onDrapStop">
            <!-- Background -->
            <Background :gap="20" />

            <!-- Top Right Panel -->
            <Panel position="top-left">
              <!-- Zoom In -->
              <button-icon size="md" icon="mdi-magnify-plus-outline" @click="zoomIn" />
              <!-- Zoom Out -->
              <button-icon size="md" icon="mdi-magnify-minus-outline" @click="zoomOut" />
              <!-- Default Zoom -->
              <button-icon size="md" icon="mdi-magnify-remove-outline" @click="setViewport({ x: 0, y: 0, zoom: 1 })" />
              <!-- Fit to Screen -->
              <button-icon size="md" icon="mdi-magnify-scan" @click="fitView" />
            </Panel>
          </VueFlow>
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/style.css";

.page {
  box-shadow: inset 0 0 10px 0 $light-shadow-0;
}

.body--dark .page {
  box-shadow: inset 0 0 10px 0 $dark-shadow;
}
</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { getDiagramTypeIcon } from 'src/scripts/util/utilities';
import { Panel, useVueFlow, VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Logging } from 'src/scripts/util/logging';
import { EDocumentType } from 'src/scripts/util/types';
import ProjectTree from 'components/app/ProjectTree.vue';
import { NodeDocument } from 'src/scripts/firestore/node-document';
import { Diagram, IDiagramData } from 'src/scripts/firestore/diagram';
import ButtonIcon from 'components/common/ButtonIcon.vue';

// Composable
const cmp = useComposables();
const {
  onInit,
  fitView, getViewport, setViewport, zoomIn, zoomOut
} = useVueFlow();

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

// Previous diagram ID
const previousDiagramId = ref(cmp.sessionStore.currentDiagramId);

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

/**
 * Lifecycle event method called before this component is unmounted.
 */
onBeforeUnmount(() => {
  if (diagram.value) {
    // Update the diagram
    updateDiagram(diagram.value as Diagram);
  }
});

/**
 * Trigger method when the pane is initialized.
 */
onInit(() => {
  if (diagram.value) {
    // Initialize diagram
    initDiagram(diagram.value as Diagram);
  }
});

function onDiagramSwitched(): void {
  Logging.debug('ModelingPage#onDiagramSwitched');
  // Get active project
  const project = cmp.sessionStore.project;
  if (project) {
    // Get previous diagram
    if (previousDiagramId.value !== null) {
      const diagram = project.getDocument<IDiagramData, Diagram>(
        EDocumentType.diagram,
        previousDiagramId.value
      );
      // Update previous diagram document
      updateDiagram(diagram);
    }
  }
  // Initialize current diagram
  if (diagram.value) {
    initDiagram(diagram.value as Diagram);
    previousDiagramId.value = diagram.value.id;
  }
}

function onDragOver(event: DragEvent): void {
  if (cmp.sessionStore.dragOperation) {
    // Get source document
    const sourceDocument = cmp.sessionStore.dragOperation.sourceDocument;
    // Get target element
    const element = event.target as Element;
    // Get target document
    const targetDocument = getTargetDocument(element);
    // Check, if source is droppable on the target
    if (targetDocument !== undefined && sourceDocument.isDroppable(targetDocument)) {
      cmp.sessionStore.dragOperation.targetDocument = targetDocument;
      cmp.sessionStore.dragOperation.droppable = true;
      event.preventDefault();
    }
  }
}

function onDrapStop(): void {
  // Check of active drag operation
  if (cmp.sessionStore.dragOperation && cmp.sessionStore.dragOperation.droppable) {
    // Get source document
    const sourceDocument = cmp.sessionStore.dragOperation.sourceDocument;
    // Get target document
    const targetDocument = cmp.sessionStore.dragOperation.targetDocument;

    console.debug(sourceDocument, targetDocument);
  }
  // Reset drag operation
  cmp.sessionStore.dragOperation = null;
}

function getTargetDocument(element: Element): NodeDocument<any> | null | undefined {
  // Check Vue Board as target
  if (element.classList.contains('vue-flow__pane')) {
    return null;
  }
  // Unexpected state
  return undefined;
}

function initDiagram(diagram: Diagram): void {
  Logging.debug('ModelingPage#initDiagram', diagram.getName());
  const data = diagram.data as IDiagramData;
  setViewport({ x: data.viewport.x, y: data.viewport.y, zoom: data.viewport.zoom });
}

function updateDiagram(diagram: Diagram): void {
  Logging.debug('ModelingPage#updateDiagram', diagram.getName());
  const data = diagram.data as IDiagramData;
  // Update viewport of the diagram
  const vp = getViewport();
  data.viewport = { x: vp.x, y: vp.y, zoom: vp.zoom };
  // Update diagram
  Diagram.updateDocument(diagram);
}

</script>
