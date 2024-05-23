<template>
  <!-- Empty Page -->
  <q-page class="flex flex-center" v-if="items.length === 0">
    <!-- Main DIV -->
    <div class="overview-page-empty q-col-gutter-y-md">
      <!-- Empty Message Row -->
      <div class="row">
        <!-- Empty Message Column -->
        <div class="col text-center">{{ $t(`${type}.overview.empty`) }}</div>
      </div>
      <!-- Create Button Row -->
      <div class="row">
        <!-- Create Button Column -->
        <div class="col text-center q-gutter-y-md">
          <div>
            <!-- Create Button -->
            <button-push :label="$t(`${type}.button.create`)"
                         v-if="permission(EEditorMode.create)"
                         @click="openEditor(type, EEditorMode.create)" />
          </div>
          <div>
            <!-- Close Button -->
            <button-push :label="$t('button.close')"
                         flat
                         color="#808080"
                         @click="cmp.router.push({path: '/'})" />
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <!-- Overview Page -->
  <page-frame :title="$t(`${type}.overview.title`)"
              :message="$t(`${type}.overview.message`)"
              v-if="items.length > 0">
    <!-- Template: Buttons -->
    <template #buttons>
      <!-- Create Button -->
      <button-push :label="$t(`${type}.button.create`)"
                   v-if="permission(EEditorMode.create)"
                   @click="openEditor(type, EEditorMode.create)" />
      <!-- Close Button -->
      <button-push :label="$t('button.close')"
                   color="#808080"
                   flat
                   @click="cmp.router.push({path: '/'})" />
    </template>
    <!-- Table -->
    <q-table :rows="items"
             :columns="columns"
             :rows-per-page-label="$t('label.rowsPerPage')"
             :pagination-label="(f, e, t) => f + ' - ' + e + ' / ' + t"
             :pagination="{ rowsPerPage: 10, sortBy: 'name' }"
             wrap-cells flat>
      <!-- Template: Header Column -->
      <template #header-cell="props">
        <!-- Table Header Cell -->
        <q-th :props="props">
          <!-- Header Label -->
          <span class="overview-table-header">{{ props.col.label }}</span>
        </q-th>
      </template>
      <!-- Template: Actions -->
      <template #body-cell-actions="props">
        <!-- Table Cell -->
        <q-td :props="props" class="vertical-top">
          <div class="overview-table-actions">
            <!-- View Button -->
            <button-icon size="sm" icon="visibility"
                         v-if="permission(EEditorMode.view, props.row)"
                         @click="openEditor(type, EEditorMode.view, props.row.id)" />
            <!-- Edit Button -->
            <button-icon size="sm" icon="edit"
                         v-if="permission(EEditorMode.edit, props.row)"
                         @click="openEditor(type, EEditorMode.edit, props.row.id)" />
            <!-- Delete Button -->
            <button-icon size="sm" icon="delete"
                         v-if="permission(EEditorMode.delete, props.row)"
                         @click="confirmDeletion(props.row)" />
          </div>
        </q-td>
      </template>
      <!-- Template: Name & Description -->
      <template #body-cell-name="props">
        <!-- Table Cell -->
        <q-td :props="props" class="vertical-top">
          <!-- Name -->
          <div>{{ (props.row.data as fd.IDocumentCommonData).common.name }}</div>
          <!-- Description -->
          <div class="overview-table-hint">{{ (props.row.data as fd.IDocumentCommonData).common.description }}</div>
        </q-td>
      </template>
      <!-- Template: Created By At -->
      <template #body-cell-created="props">
        <!-- Table Cell -->
        <q-td :props="props" class="vertical-top">
          <!-- Created By -->
          <div>{{ (props.row.data as fd.IDocumentMetaData).meta?.created.by }}</div>
          <div>{{ formatTimestamp((props.row.data as fd.IDocumentMetaData).meta?.created.at) }}</div>
        </q-td>
      </template>
      <!-- Template: Altered By At -->
      <template #body-cell-altered="props">
        <!-- Table Cell -->
        <q-td :props="props" class="vertical-top">
          <!-- Created By -->
          <div>{{ (props.row.data as fd.IDocumentMetaData).meta?.altered?.by }}</div>
          <div>{{ formatTimestamp((props.row.data as fd.IDocumentMetaData).meta?.altered?.at) }}</div>
        </q-td>
      </template>
      <!-- Template: Custom Columns -->
      <template v-for="col in customColumns"
                :key="col.name"
                v-slot:[`body-cell-${col.name}`]="props">
        <!-- Slot -->
        <slot :name="`body-cell-${col.name}`" :props="props">
          <!-- Table Cell -->
          <q-td :props="props" class="vertical-top">
            <!-- Field Value -->
            {{ props.value }}
          </q-td>
        </slot>
      </template>
    </q-table>
  </page-frame>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.overview-page-empty {
  width: 500px;
}

.overview-table-header {
  font-size: 10pt;
  font-variant: petite-caps;
  color: $primary;
}

.overview-table-actions {
  color: $light-text;
}

.body--dark .overview-table-actions {
  color: $dark-text;
}

.overview-table-hint {
  font-size: 8pt;
  color: $light-text-hint;
}

.body--dark .overview-table-hint {
  color: $dark-text-hint;
}
</style>

<script setup lang="ts">
import * as fd from 'src/scripts/firestore/firestore-document';
import { FirestoreDocument, IDocumentCommonData } from 'src/scripts/firestore/firestore-document';
import * as cp from 'src/scripts/util/composables';
import { EDocumentType, EEditorMode } from 'src/scripts/util/types';
import ButtonPush from 'components/common/ButtonPush.vue';
import PageFrame from 'components/app/PageFrame.vue';
import { computed } from 'vue';
import { QTableColumn } from 'quasar';
import ButtonIcon from 'components/common/ButtonIcon.vue';

// Composable
const cmp = cp.useComposables();
const formatTimestamp = cp.useFormatTimestamp();
const { showConfirmationDialog } = cp.useMessageDialog();
const { openEditor } = cp.useRouting();
const runTask = cp.useRunTask();

// Defines the properties of this component.
const props = defineProps<{
  // Document type of the items to be shown in the overview
  type: EDocumentType;
  // The items to be shown in the overview
  items: any[];
  // Custom Columns
  customColumns: QTableColumn[];
  // Function to determine permissions
  permission: (mode: EEditorMode, item?: fd.FirestoreDocument<any>) => boolean;
  // Function for deleting the item
  delete: (item: FirestoreDocument<any>) => Promise<void>;
}>();

// Column definitions for the overview table
const columns = computed(() => {
  // Columns array
  const array: QTableColumn[] = [];
  // Actions Column
  array.push({
    name: 'actions',
    label: '',
    align: 'left',
    sortable: false,
    headerStyle: 'width: 100px',
    field: ''
  });
  // Add Name & Description Column
  array.push({
    name: 'name',
    label: cmp.i18n.t(`${props.type}.label.name`),
    align: 'left',
    sortable: true,
    headerStyle: 'width: 500px',
    field: row => (row.data as fd.IDocumentCommonData).common.name
  });
  // Add Custom Columns
  array.push(...props.customColumns);
  // Add Create By At Column
  array.push({
    name: 'created',
    label: cmp.i18n.t('label.created'),
    align: 'left',
    sortable: true,
    headerStyle: 'width: 200px',
    field: row => (row.data as fd.IDocumentMetaData).meta?.created.at
  });
  // Add Altered By At Column
  array.push({
    name: 'altered',
    label: cmp.i18n.t('label.altered'),
    align: 'left',
    sortable: true,
    field: row => (row.data as fd.IDocumentMetaData).meta?.altered?.at
  });
  // Return the array
  return array;
});

/**
 * Shows a confirmation dialog and deletes the specified item if confirmed.
 *
 * @param {FirestoreDocument<IDocumentCommonData>} item - The item to be deleted.
 *
 * @return {void}
 */
function confirmDeletion(item: FirestoreDocument<IDocumentCommonData>): void {
  // Show confirmation dialog
  showConfirmationDialog(
    cmp.i18n.t('dialog.delete.title', { type: cmp.i18n.t(`${props.type}.type`) }),
    cmp.i18n.t('dialog.delete.message', {
      type: cmp.i18n.t(`${props.type}.type`),
      article: cmp.i18n.t(`${props.type}.article`),
      name: item.data.common.name
    }),
    undefined,
    async (value) => {
      if (value === 'okay') {
        await runTask(async () => {
          // Call the delete function
          await props.delete(item);
        });
      }
    }
  );
}

</script>
