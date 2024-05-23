<template>
  <!-- Main DIV -->
  <div class="q-col-gutter-y-md">
    <!-- Message Row -->
    <div class="row" v-if="message">
      <!-- Message Column -->
      <div class="col-8">{{ message }}</div>
    </div>

    <!-- Empty Table Message Row -->
    <div class="row" v-if="rows.length === 0 && messageEmpty">
      <!-- Empty Table Message Column -->
      <div class="col-8 table-empty-message">{{ messageEmpty }}</div>
    </div>

    <!-- Table Row -->
    <div class="row" v-if="rows.length > 0">
      <!-- Table Column -->
      <div class="col">
        <!-- Table -->
        <q-table :rows="rows"
                 :columns="tableColumns"
                 :rows-per-page-label="$t('label.rowsPerPage')"
                 :pagination-label="(f, e, t) => f + ' - ' + e + ' / ' + t"
                 :pagination="{ rowsPerPage: 10 }"
                 :hide-pagination="!usePagination"
                 flat wrap-cells>
          <!-- Template: Header Column -->
          <template #header-cell="props">
            <!-- Table Header Cell -->
            <q-th :props="props">
              <!-- Header Label -->
              <span class="editable-table-header">{{ props.col.label }}</span>
            </q-th>
          </template>
          <!-- Template: Selector Column -->
          <template #body-cell-selector="props">
            <!-- Table Column Cell -->
            <q-td :props="props">
              <!-- Selector Radio Button -->
              <q-radio v-model="rowIndex" :val="props.rowIndex" size="xs" />
            </q-td>
          </template>
          <!-- Template: Custom Columns -->
          <template v-for="col in columns" :key="col.name" v-slot:[`body-cell-${col.name}`]="props">
            <!-- Slot -->
            <slot :name="'body-cell-' + col.name" :props="props">
              <!-- Table Column -->
              <q-td :props="props" class="editable-table-column">
                <!-- Table Column Value -->
                <div v-if="getInputType(col, props.row) !== 'checkbox'">{{ props.value }}</div>
                <!-- Table Column Checkbox -->
                <div v-if="getInputType(col, props.row) === 'checkbox'">
                  <!-- Checkbox -->
                  <q-checkbox v-model="props.row[col.name]" dense v-if="!readonly" />
                  <!-- True Icon Readonly -->
                  <q-icon name="check" v-if="readonly && props.row[col.name]" />
                </div>
                <!-- Popup Edit: Selection -->
                <q-popup-edit :ref="`pe_${col.name}_${props.rowIndex}`"
                              v-model="props.row[col.name]"
                              v-if="!readonly && getInputType(col, props.row) === 'select'"
                              v-slot="scope"
                              anchor="center middle"
                              @show="(<typeof FieldSelect>$refs.select).showPopup()">
                  <!-- Selection Input -->
                  <field-select ref="select"
                                v-model="scope.value"
                                :options="col.options as TSelectionOption<any>[]"
                                :translate="col.translate"
                                :show-icons="col.showIcons"
                                borderless
                                @update:modelValue="value => onValueUpdated(props.rowIndex, col.name, value,
                                                              <QPopupEdit>$refs[`pe_${col.name}_${props.rowIndex}`])" />
                </q-popup-edit>
                <!-- Popup Edit: String -->
                <q-popup-edit :ref="`pe_${col.name}_${props.rowIndex}`"
                              v-model="props.row[col.name]"
                              v-if="!readonly && getInputType(col, props.row) === 'string'"
                              v-slot="scope"
                              anchor="center middle"
                              @show="(<typeof FieldInput>$refs.input).select()">
                  <!-- Text Input -->
                  <field-input ref="input"
                               v-model="scope.value"
                               borderless
                               hide-bottom-space
                               @focusout="onValueUpdated(props.rowIndex, col.name, scope.value)"
                               @keyup.enter="(<QPopupEdit>$refs[`pe_${col.name}_${props.rowIndex}`]).hide()"
                               @blur="(<QPopupEdit>$refs[`pe_${col.name}_${props.rowIndex}`]).hide()" />
                </q-popup-edit>
              </q-td>
            </slot>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Table Button Row -->
    <div class="row" v-if="!readonly">
      <!-- Table Button Column -->
      <div class="col q-gutter-x-sm">
        <!-- Add Row Button -->
        <button-icon size="md" icon="add"
                     v-if="add"
                     highlighted dense
                     @click="addRow" />
        <!-- Remove Row Button -->
        <button-icon size="md" icon="remove"
                     v-if="deletable && rowIndex > -1"
                     highlighted dense
                     @click="deleteRow" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.table-empty-message {
  font-size: 8pt;
  color: $light-text-hint;
}

.body--dark .table-empty-message {
  color: $dark-text-hint;
}

.editable-table-header {
  font-size: 10pt;
  font-variant: petite-caps;
  color: $primary;
}

.editable-table-column {
  font-size: 9pt;
}
</style>

<script setup lang="ts">
import ButtonIcon from 'components/common/ButtonIcon.vue';
import { TEditableTableColumn, TEditableTableColumnInput } from 'src/scripts/util/types';
import { computed, ref } from 'vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { QPopupEdit } from 'quasar';
import { TSelectionOption } from 'src/scripts/config/options';
import FieldInput from 'components/common/FieldInput.vue';

// Defines the properties of this component.
const props = defineProps<{
  // Rows to be displayed
  rows: any[];
  // Column definitions
  columns: TEditableTableColumn[];
  // Flag controlling whether a row can be deleted
  deletable?: boolean;
  // Flag controlling whether rows can be moved
  movable?: boolean;
  // Message of the table
  message?: string;
  // Message for an empty table
  messageEmpty?: string;
  // Flag controlling whether this table is readonly
  readonly?: boolean;
  // Flag controlling whether the pagination is supported
  usePagination?: boolean;
  // Validator
  validator?: (rowIndex: number, columnName: string, oldValue: any, newValue: any) => any;
  // Handler for adding a new row
  add?: () => void;
}>();

// Select row index
const rowIndex = ref(-1);

// Computed table column definitions.
const tableColumns = computed(() => {
  // The editable table column definitions
  const tableColumns: TEditableTableColumn[] = [];
  // If table rows are either deletable or movable, add selection column
  if ((props.deletable || props.movable) && !props.readonly) {
    tableColumns.push({
      name: 'selector',
      label: '',
      align: 'center',
      headerStyle: 'width: 75px',
      field: ''
    });
  }
  // Add custom column definitions
  tableColumns.push(...props.columns);
  // Check, if last custom column has a headerStyle attribute, if so, add an empty column
  if (props.columns.length > 0 && props.columns[props.columns.length - 1].headerStyle) {
    tableColumns.push({
      name: 'empty',
      label: '',
      field: ''
    });
  }
  // Return the editable table column definitions
  return tableColumns;
});

/**
 * Adds a new row by calling the provided handler.
 *
 * @return {void} This method does not return anything.
 */
function addRow(): void {
  // Check if a handler was provided
  if (props.add) {
    // Call the handler
    props.add();
  }
}

/**
 * Deletes a row from the rows array at the specified index.
 *
 * @return {void}
 */
function deleteRow(): void {
  if (rowIndex.value > -1) {
    props.rows.splice(rowIndex.value, 1);
    if (props.rows.length === 0) {
      rowIndex.value = -1;
    }
  }
}

/**
 * Returns the input type for a given column and row in an editable table.
 *
 * @param {TEditableTableColumn} column - The column for which to determine the input type.
 * @param {any} row - The row for which to determine the input type.
 *
 * @returns {TEditableTableColumnInput} - The input type for the given column and row.
 */
function getInputType(column: TEditableTableColumn, row: any): TEditableTableColumnInput {
  if (typeof column.input === 'function') {
    // If input type is a function, evaluate the function
    return column.input(row);
  } else if (column.input) {
    // Return the static input type
    return column.input;
  } else {
    // Return default
    return 'none';
  }
}

/**
 * Updates the value of a specific cell in a table row.
 *
 * @param {number} rowIndex - The index of the row in which the value is to be updated.
 * @param {string} columnName - The name of the column for which the value is to be updated.
 * @param {any} newValue - The new value to be assigned to the cell.
 * @param {QPopupEdit} [popupEdit] - Optional parameter. The QPopupEdit instance to be hidden after the value is updated.
 *
 * @returns {void}
 */
function onValueUpdated(
  rowIndex: number,
  columnName: string,
  newValue: any,
  popupEdit?: QPopupEdit | undefined
): void {
  // Get the old value
  const oldValue = props.rows[rowIndex][columnName];
  // Set the new value
  props.rows[rowIndex][columnName] = props.validator
    ? props.validator(rowIndex, columnName, oldValue, newValue)
    : newValue;
  // Hide the popup editor
  if (popupEdit) {
    popupEdit.hide();
  }
}

</script>
