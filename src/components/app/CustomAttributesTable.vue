<template>
  <!-- Editable Table -->
  <editable-table :columns="[{ name: 'key', label: $t('label.key'), align: 'left', headerStyle: 'width: 300px',
                               input: 'string', field: row => row.key},
                             { name: 'type', label: $t('label.type'), align: 'left', headerStyle: 'width: 200px',
                               input: 'select', options: getTypeOptions(), translate: true,
                               field: row => $t(`enum.type.${row.type}`) },
                             { name: 'value', label: $t('label.value'), align: 'left',
                               input: row => row.type === EDocumentAttributeType.boolean ? 'checkbox' : 'string',
                               field: row => row.value }
                            ]"
                  :rows="attributes"
                  :message="$t('message.customAttributes.message')"
                  :message-empty="$t('message.customAttributes.messageEmpty')"
                  :add="addAttribute"
                  :validator="validateAttribute"
                  :readonly="readonly"
                  deletable />
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import EditableTable from 'components/common/EditableTable.vue';
import { EDocumentAttributeType, TDocumentAttribute } from 'src/scripts/util/types';
import { getTypeOptions } from 'src/scripts/config/options';
import { toBoolean, toNumber } from 'src/scripts/util/utilities';

// Defines the properties of this component.
const props = defineProps<{
  // Attributes
  attributes: TDocumentAttribute[];
  // Flag controlling whether this table is readonly
  readonly?: boolean;
}>();

/**
 * Adds a new custom attribute to the table.
 *
 * @returns {void}
 */
function addAttribute(): void {
  // Look for the next free attribute name
  let index = 0;
  while (props.attributes.some(att => att.key === `attribute_${index}`)) {
    index++;
  }
  // Add the new attribute
  props.attributes.push({
    key: `attribute_${index}`,
    type: EDocumentAttributeType.string,
    value: '...'
  });
}

/**
 * Validates and transforms the attribute value based on the given column name.
 *
 * @param {number} rowIndex - The index of the attribute row.
 * @param {string} columnName - The name of the attribute column.
 * @param {*} oldValue - The previous value of the attribute.
 * @param {*} newValue - The new value of the attribute.
 *
 * @returns {*} - The validated and transformed value for the attribute.
 */
function validateAttribute(rowIndex: number, columnName: string, oldValue: any, newValue: any): any {
  // Check the key column
  if (columnName === 'key') {
    // Remove all special character from the name
    newValue = (newValue as string).replace(/[^a-zA-Z0-9_]/g, '');
    // Make the first character as lower case
    newValue = (newValue as string).substring(0, 1).toLowerCase() + (newValue as string).substring(1);
    // Check if the new key isn't already used, if so, replace with old value
    if (props.attributes.some((att, index) => rowIndex !== index && newValue === att.key)) {
      newValue = oldValue;
    }
  }
  // Check the type column
  else if (columnName === 'type') {
    // Get the type
    const type = newValue as EDocumentAttributeType;
    // Check string type
    if (type === EDocumentAttributeType.string) {
      props.attributes[rowIndex].value = props.attributes[rowIndex].value.toString();
    }
    // Check number type
    else if (type === EDocumentAttributeType.number) {
      const value = toNumber(props.attributes[rowIndex].value);
      if (value === null) {
        props.attributes[rowIndex].value = 0;
      } else {
        props.attributes[rowIndex].value = value;
      }
    }
    // Check boolean type
    else if (type === EDocumentAttributeType.boolean) {
      props.attributes[rowIndex].value = toBoolean(props.attributes[rowIndex].value);
    }
  }
  // Check the value column
  else if (columnName === 'value') {
    // Get the type
    const type = props.attributes[rowIndex].type;
    // Check number type
    if (type === EDocumentAttributeType.number) {
      const value = toNumber(newValue);
      newValue = value !== null ? value : oldValue;
    }
  }
  // Return the new value
  return newValue;
}

</script>
