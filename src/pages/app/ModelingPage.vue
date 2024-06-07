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
                   :nodes="nodes"
                   :nodes-draggable="!readOnly"
                   select-nodes-on-drag
                   @keyup.delete="deleteSelectedNodes"
                   @dragover="onDragOver"
                   @drop="onDrapStop">
            <!-- Background -->
            <Background :gap="20" />

            <!-- Layer Node -->
            <template #node-layer="props">
              <LayerNode :document="props.data" />
            </template>

            <!-- Top Right Panel -->
            <Panel position="top-left">
              <div class="q-gutter-x-sm">
                <!-- Zoom In -->
                <button-icon highlighted size="sm" icon="mdi-magnify-plus-outline"
                             @click="() => { zoomIn(); applyViewport(); }" />
                <!-- Zoom Out -->
                <button-icon highlighted size="sm" icon="mdi-magnify-minus-outline"
                             @click="() => { zoomOut(); applyViewport(); }" />
                <!-- Default Zoom -->
                <button-icon highlighted size="sm" icon="mdi-magnify-remove-outline"
                             @click="() => { setViewport({ x: 0, y: 0, zoom: 1 }); applyViewport(); }" />
                <!-- Fit to Screen -->
                <button-icon highlighted size="sm" icon="mdi-magnify-scan"
                             @click="() => { fitView(); applyViewport(); }" />
              </div>
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
import { useComposables, useRouting } from 'src/scripts/util/composables';
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { getDiagramTypeIcon } from 'src/scripts/util/utilities';
import { Panel, useVueFlow, ViewportTransform, VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Logging } from 'src/scripts/util/logging';
import { EDocumentType, EEditorMode, EProjectMemberRole } from 'src/scripts/util/types';
import ProjectTree from 'components/app/ProjectTree.vue';
import { NodeDocument } from 'src/scripts/firestore/node-document';
import { Diagram, IDiagramData } from 'src/scripts/firestore/diagram';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import LayerNode from 'components/app/node/LayerNode.vue';

// Composable
const cmp = useComposables();
const {
  onInit, onMoveEnd, onNodeDragStop, onNodeDoubleClick, onNodeContextMenu,
  fitView, getViewport, setViewport, zoomIn, zoomOut, getSelectedNodes, removeNodes, addSelectedNodes
} = useVueFlow();
const { openEditor } = useRouting();

// Diagrams of the current project
const diagrams = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.getDiagrams() : [];
});

// Current diagram
const diagram = computed(() => {
  return cmp.sessionStore.project && cmp.sessionStore.currentDiagramId
    ? cmp.sessionStore.project.getDocument<IDiagramData, Diagram>(EDocumentType.diagram, cmp.sessionStore.currentDiagramId)
    : undefined;
});

// Current diagram nodes
const nodes = computed(() => {
  if (diagram.value) {
    return (diagram.value as Diagram).createVueFlowNodes();
  }
  return [];
});

// Read-Only flag
const readOnly = computed(() => {
  return cmp.sessionStore.project ? cmp.sessionStore.project.hasRole(EProjectMemberRole.visitor) : false;
});

// Previous diagram ID
const previousDiagramId = ref(cmp.sessionStore.currentDiagramId);
// Initialization flag
const isInitialized = ref(false);

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
  // Initialize if necessary
  if (!isInitialized.value && diagram.value) {
    initDiagram(diagram.value as Diagram);
  }
});

/**
 * Lifecycle event method called before this component is unmounted.
 */
onBeforeUnmount(() => {
  Logging.debug('ModelingPage#onBeforeUnmount');
  applyViewport(diagram.value as Diagram);
  saveDiagram(diagram.value as Diagram);
  isInitialized.value = false;
});

/**
 * Trigger method when the pane is initialized.
 */
onInit(() => {
  Logging.debug('ModelingPage#onInit');
  if (diagram.value) {
    // Initialize diagram
    initDiagram(diagram.value as Diagram);
    previousDiagramId.value = diagram.value.id;
  }
});

/**
 * Trigger method when the pane was moved.
 */
onMoveEnd((event) => {
  Logging.debug('ModelingPage#onMoveEnd');
  applyViewport(diagram.value as Diagram, event.flowTransform);
});

/**
 * Trigger method when a node is double-clicked.
 */
onNodeDoubleClick((event) => {
  // Open Editor
  openEditor(
    event.node.type as EDocumentType,
    readOnly.value ? EEditorMode.view : EEditorMode.edit,
    event.node.id
  );
});

/**
 * Trigger method when a node is right-clicked.
 */
onNodeContextMenu((event) => {
  // Add node to selection
  addSelectedNodes([event.node]);
});

/**
 * Trigger method when dragging a node has stopped.
 */
onNodeDragStop((event) => {
  if (diagram.value) {
    // Get active diagram
    const dg = diagram.value as Diagram;
    // Iterate over all selected nodes
    for (const node of event.nodes) {
      // Get diagram node
      const diagramNode = dg.getNode(node.id);
      if (diagramNode) {
        // Update position
        diagramNode.position = { x: node.position.x, y: node.position.y };
      }
    }
  }
});

/**
 * Triggers when a diagram is switched on the Modeling Page.
 */
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
      applyViewport(diagram);
      saveDiagram(diagram);
    }
  }
  // Initialize current diagram
  if (diagram.value) {
    initDiagram(diagram.value as Diagram);
    previousDiagramId.value = diagram.value.id;
  }
}

/**
 * Handles the "dragover" event on a target element.
 * Determines if the source document can be dropped onto the target element.
 *
 * @param {DragEvent} event - The event object representing the dragover event.
 *
 * @return {void}
 */
function onDragOver(event: DragEvent): void {
  if (cmp.sessionStore.dragOperation && diagram.value) {
    // Get active diagram
    const dg = diagram.value as Diagram;
    // Get source document
    const sourceDocument = cmp.sessionStore.dragOperation.sourceDocument;
    // Check, if source document is not already part of the diagram
    if (!dg.hasNode(sourceDocument.id)) {
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
}

/**
 * Handles the drag stop event.
 *
 * @param {DragEvent} event - The drag event.
 *
 * @return {void}
 */
function onDrapStop(event: DragEvent): void {
  // Current diagram
  const dg = diagram.value as Diagram;
  // Check of active drag operation
  if (cmp.sessionStore.dragOperation && cmp.sessionStore.dragOperation.droppable) {
    // Get source document
    const sourceDocument = cmp.sessionStore.dragOperation.sourceDocument as NodeDocument<any>;
    // Get target document
    const targetDocument = cmp.sessionStore.dragOperation.targetDocument as NodeDocument<any> | null;
    // Calculate position
    const dm = sourceDocument.getDefaultDimension();
    const vp = getViewport();
    const px = (vp.x * -1 / vp.zoom + event.offsetX / vp.zoom) - (dm.width / 2);
    const py = (vp.y * -1 / vp.zoom + event.offsetY / vp.zoom) - (dm.height / 2);
    // Add node to diagram
    dg.addNode(sourceDocument, targetDocument, { x: px, y: py });
    console.debug(dg);
    // Update diagram
    Diagram.updateDocument(dg);
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

/**
 * Initializes the diagram with the given data.
 *
 * @param {Diagram} diagram - The diagram to initialize.
 *
 * @return {void}
 */
function initDiagram(diagram: Diagram): void {
  const data = diagram.data as IDiagramData;
  Logging.debug('ModelingPage#initDiagram', diagram.getName(), data);
  setViewport(diagram.data.viewport);
  isInitialized.value = true;
}

/**
 * Deletes the selected nodes from the diagram.
 *
 * This method removes all the selected nodes from the current diagram and also removes them from Vue Flow.
 *
 * @returns {void}
 */
function deleteSelectedNodes(): void {
  if (diagram.value) {
    // Get active diagram
    const dg = diagram.value as Diagram;
    // Get selected nodes
    const nodes = getSelectedNodes.value;
    // Remove all nodes from the current diagram
    for (const node of nodes) {
      dg.removeNode(node.id);
    }
    // Remove nodes from Vue Flow
    removeNodes(nodes);
  }
}

/**
 * Applies the provided viewport transform to the diagram.
 *
 * @param {Diagram} [_diagram] - The diagram object. If not provided, the global `diagram` object will be used.
 * @param {ViewportTransform} [_transform] - The viewport transform to apply. If not provided, the current viewport transform will be used.
 *
 * @returns {void}
 */
function applyViewport(_diagram?: Diagram, _transform?: ViewportTransform): void {
  _diagram = _diagram ? _diagram : diagram.value;
  _transform = _transform ? _transform : getViewport();
  if (_diagram) {
    Logging.debug('ModelingPage#applyViewport', _diagram.data.viewport, _transform);
    _diagram.data.viewport.x = _transform.x;
    _diagram.data.viewport.y = _transform.y;
    _diagram.data.viewport.zoom = _transform.zoom;
  }
}

/**
 * Saves the given diagram.
 *
 * @param {Diagram} _diagram - The diagram to be saved. If not provided, the value of `diagram.value` will be used.
 *
 * @return {void}
 */
function saveDiagram(_diagram?: Diagram): void {
  _diagram = _diagram ? _diagram : diagram.value;
  if (_diagram) {
    Diagram.updateDocument(_diagram);
  }
}

</script>
