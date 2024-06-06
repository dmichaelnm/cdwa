<template>
  <!-- Main DIV -->
  <div>
    <!-- Search Text Row -->
    <div class="row">
      <!-- Search Text Column -->
      <div class="col">
        <!-- Search Text Input -->
        <field-input v-model="searchText"
                     :label="$t('label.search')"
                     icon-prepend="search"
                     squared no-stack-label clearable hide-bottom-space
                     @clear="searchText = ''" />
      </div>
    </div>
    <!-- Tool Buttons Row -->
    <div class="row">
      <!-- Tool Buttons Column -->
      <div class="col tool-buttons">
        <!-- Expand all Nodes -->
        <button-icon size="xs" icon="expand_more" @click="projectTree?.expandAll()"/>
        <!-- Collapse all Nodes -->
        <button-icon size="xs" icon="expand_less" @click="projectTree?.collapseAll()" />
      </div>
    </div>
    <!-- Project Tree Row -->
    <div class="row">
      <!-- Project Tree Column -->
      <div class="col project-tree">
        <!-- Project Tree -->
        <q-tree ref="projectTree"
                v-model:selected="selectedNodeKey"
                v-model:expanded="cmp.sessionStore.expandedNodeKeys"
                node-key="key"
                :accordion="false"
                :nodes="treeNodes"
                :filter="searchText"
                no-connectors>
          <!-- Template: Header Translate -->
          <template #default-header="props">
            <!-- Tree Node DIV -->
            <div style="width: 100%"
                 :draggable="props.node.draggable"
                 @mouseenter="hoveredNodeKey = props.node.key"
                 @mouseleave="hoveredNodeKey = null"
                 @dragstart="onDragStart">
              <!-- Tree Node Row -->
              <div class="row project-tree-node items-center no-wrap">
                <!-- Tree Node Icon Column -->
                <div class="col-auto" style="padding-right: 8px">
                  <!-- Tree Node Icon -->
                  <q-icon v-if="props.node.icon"
                          size="xs"
                          :name="typeof props.node.icon === 'function' ? props.node.icon() : props.node.icon" />
                </div>
                <!-- Tree Node Label Column -->
                <div class="col-grow ellipsis">{{ props.node.translate ? $t(props.node.label) : props.node.label }}
                </div>
                <!-- Button Column -->
                <div class="col-auto text-right" style="min-width: 48px">
                  <!-- Add Button -->
                  <button-icon size="xs" icon="mdi-plus"
                               v-if="showButton(props.node.key, EEditorMode.create)"
                               @click="openDocument(props.node.key, EEditorMode.create)" />
                  <!-- Overview Button -->
                  <button-icon size="xs" icon="mdi-view-list-outline"
                               v-if="showButton(props.node.key, 'overview')"
                               @click="openOverview(props.node.key)" />
                  <!-- View Button -->
                  <button-icon size="xs" icon="mdi-eye-outline"
                               v-if="showButton(props.node.key, EEditorMode.view)"
                               @click="openDocument(props.node.key, EEditorMode.view)" />
                  <!-- Edit Button -->
                  <button-icon size="xs" icon="mdi-pencil-outline"
                               v-if="showButton(props.node.key, EEditorMode.edit)"
                               @click="openDocument(props.node.key, EEditorMode.edit)" />
                  <!-- Delete Button -->
                  <button-icon size="xs" icon="mdi-trash-can-outline"
                               v-if="showButton(props.node.key, EEditorMode.delete)"
                               @click="deleteDocument(props.node.key)" />
                </div>
              </div>
            </div>
          </template>
        </q-tree>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.project-tree {
  padding: 2px 8px;
}

.project-tree-node {
  font-size: 9pt;
  color: $light-text;
  height: 24px;
}

.body--dark .project-tree-node {
  color: $dark-text;
}

.project-tree-node-selected {
  font-weight: bold;
}

.tool-buttons {
  text-align: right;
  padding: 4px;
}
</style>

<script setup lang="ts">
import { useComposables, useConfirmDeletion, useRouting } from 'src/scripts/util/composables';
import FieldInput from 'components/common/FieldInput.vue';
import { computed, ref } from 'vue';
import { QTree } from 'quasar';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import { EEditorMode, TTreeNode } from 'src/scripts/util/types';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { FirestoreDocument, IDocumentCommonData } from 'src/scripts/firestore/firestore-document';

// Composable
const cmp = useComposables();
const confirmDeletion = useConfirmDeletion();
const { openEditor, to } = useRouting();

// Tree reference
const projectTree = ref<QTree | null>(null);

// Tree Nodes
const treeNodes = computed(() => {
  // Get project
  const project = cmp.sessionStore.project;
  // Return the nodes for the current project
  return project ? project.getTreeNodes() : [];
});

// Search Text
const searchText = ref('');
// Hovered Node Key
const hoveredNodeKey = ref<string | null>(null);
// Selected Node Key
const selectedNodeKey = ref<string | null>(null);

/**
 * Show button based on the given key and mode.
 *
 * @param {string} key - The key of the node.
 * @param {EEditorMode | string} mode - The mode of the editor.
 *
 * @returns {boolean} - Returns `true` if the button should be shown, otherwise `false`.
 */
function showButton(key: string, mode: EEditorMode | string): boolean {
  // Check if node is hovered
  if (key === hoveredNodeKey.value) {
    // Get node
    const node = projectTree.value?.getNodeByKey(key) as TTreeNode;
    if (node) {
      // Check Create Button
      if (mode === EEditorMode.create) {
        return node.document === undefined && node.permission(mode);
      }
      // Check Overview Button
      if (mode === 'overview') {
        return node.document === undefined;
      }
      // Check View Button
      if (mode === EEditorMode.view) {
        return node.document !== undefined && node.permission(mode);
      }
      // Check Edit Button
      if (mode === EEditorMode.edit) {
        return node.document !== undefined && node.permission(mode);
      }
      // Check Delete Button
      if (mode === EEditorMode.delete) {
        return node.document !== undefined && node.permission(mode);
      }
    }
  }
  // Node is not hovered
  return false;
}

/**
 * Opens a document based on the provided key and mode.
 *
 * @param {string} key - The key of the document to open.
 * @param {EEditorMode} mode - The mode in which to open the document.
 *
 * @return {void}
 */
function openDocument(key: string, mode: EEditorMode): void {
  // Get node
  const node = projectTree.value?.getNodeByKey(key) as TTreeNode;
  if (node) {
    openEditor(node.type, mode, node.document?.id);
  }
}

/**
 * Opens the overview page of a node in the project tree.
 *
 * @param {string} key - The key of the node in the project tree.
 *
 * @return {void}
 */
function openOverview(key: string): void {
  // Get node
  const node = projectTree.value?.getNodeByKey(key) as TTreeNode;
  if (node) {
    to(`/${node.type}`);
  }
}

/**
 * Deletes a document from the project tree.
 *
 * @param {string} key - The key of the node representing the document to be deleted.
 *
 * @returns {Promise<void>} - A Promise that resolves when the document is successfully deleted.
 */
async function deleteDocument(key: string): Promise<void> {
  // Get node
  const node = projectTree.value?.getNodeByKey(key) as TTreeNode;
  if (node) {
    await confirmDeletion(
      node.type,
      node.document as FirestoreDocument<any>,
      ProjectDocument.deleteDocument as { (document: FirestoreDocument<IDocumentCommonData>): Promise<void> }
    );
  }
}

function onDragStart(event: DragEvent): void {
  // Hide Buttons
  hoveredNodeKey.value = null;
}

</script>
