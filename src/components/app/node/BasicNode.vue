<template>
  <NodeResizer line-class-name="hidden"
               :is-visible="isSelected && !readOnly"
               @resize-end="onNodeResized" />

  <!-- Main DIV -->
  <div :class="{ 'basic-node': true, [nodeClass]: true, [identity]: true, 'basic-node-selected': isSelected }"
       style="width:100%; height:100%;">
    <!-- Main Row -->
    <div :class="{ row: true, [identity]: true }">
      <!-- Icon Column -->
      <div v-if="icon" :class="{ 'col-auto': true, 'basic-icon': true, [identity]: true }">
        <!-- Icon -->
        <q-icon :name="icon" size="sm" :class="{ [identity]: true }" />
      </div>
      <!-- Main Column -->
      <div :class="{ 'col-grow': true, [identity]: true, ...mainClass ? { [mainClass]: true }: {} }" style="width: 90%">
        <!-- Default Slot -->
        <slot />
      </div>
    </div>

    <!-- Context Menu -->
    <q-menu touch-position
            context-menu>
      <!-- List -->
      <q-list>
        <!-- Menu Item: Properties -->
        <menu-item :label="$t('label.properties')"
                   :icon="readOnly ? 'mdi-eye-outline' : 'mdi-pencil-outline'"
                   clickable closable show-icon
                   @click="openEditor(document.type, readOnly ? EEditorMode.view : EEditorMode.edit, document.id)" />
        <!-- Separator -->
        <q-separator />
        <!-- Menu Item: Properties -->
        <menu-item :label="$t('label.delete')"
                   v-if="!readOnly"
                   icon="mdi-trash-can-outline"
                   clickable closable show-icon
                   @click="deleteNode" />
      </q-list>
    </q-menu>

  </div>

</template>

<style lang="scss">
@import "src/css/quasar.variables";
@import "@vue-flow/node-resizer/dist/style.css";

.vue-flow__resize-control.handle {
  width: 8px;
  height: 8px;
}

.basic-node {
  padding: 4px;
}

.basic-node-selected {
  box-shadow: 0 0 10px 0 $light-shadow-0;
}

.body--dark .basic-node-selected {
  box-shadow: 0 0 10px 0 $dark-shadow;
}

.basic-icon {
  padding: 4px;
}
</style>

<script setup lang="ts">
import { NodeDocument } from 'src/scripts/firestore/node-document';
import { computed } from 'vue';
import { NodeResizer, OnResizeStart } from '@vue-flow/node-resizer';
import { useVueFlow } from '@vue-flow/core';
import { useComposables, useRouting } from 'src/scripts/util/composables';
import { Diagram, IDiagramData } from 'src/scripts/firestore/diagram';
import { EDocumentType, EEditorMode, EProjectMemberRole } from 'src/scripts/util/types';
import MenuItem from 'components/common/MenuItem.vue';

// Composables
const cmp = useComposables();
const { getSelectedNodes, removeNodes } = useVueFlow();
const { openEditor } = useRouting();

// Defines the properties of this component.
const props = defineProps<{
  // Document
  document: NodeDocument<any>;
  // Node Class
  nodeClass: string;
  // Main Class
  mainClass?: string;
  // Icon
  icon?: string;
}>();

// Identity Class
const identity = computed(() => {
  return `identity_${props.document.type}_${props.document.id}`;
});

// Node is selected
const isSelected = computed(() => {
  const nodes = getSelectedNodes.value;
  return nodes.some(n => n.id === props.document.id);
});

// Read-Only flag
const readOnly = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.hasRole(EProjectMemberRole.visitor) : false;
});

/**
 * Updates the position and dimension of a diagram node when it is resized.
 *
 * @param {OnResizeStart} event - The event object containing resize parameters.
 *
 * @returns {void}
 */
function onNodeResized(event: OnResizeStart): void {
  // Get active project
  const project = cmp.sessionStore.project;
  if (project) {
    // Get active diagram
    const diagram = project.getDocument<IDiagramData, Diagram>(
      EDocumentType.diagram,
      cmp.sessionStore.currentDiagramId as string
    );
    // Get diagram node
    const node = diagram.getNode(props.document.id);
    if (node) {
      // Update position and dimension
      node.position.x = event.params.x;
      node.position.y = event.params.y;
      node.dimension.width = event.params.width;
      node.dimension.height = event.params.height;
    }
  }
}

/**
 * Deletes a node from the current diagram in the project.
 *
 * This method removes the specified node from the diagram data and updates the Vue Flow representation.
 *
 * @return {void} This method does not return anything.
 */
function deleteNode(): void {
  // Get project
  const project = cmp.sessionStore.project;
  if (project) {
    // Get diagram
    const diagram = project.getDocument<IDiagramData, Diagram>(
      EDocumentType.diagram,
      cmp.sessionStore.currentDiagramId as string
    );
    // Remove the node
    diagram.removeNode(props.document.id);
    // Remove Vue Flow node
    removeNodes(props.document.id);
  }
}

</script>
