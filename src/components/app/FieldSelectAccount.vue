<template>
  <!-- Account Selection Dialog -->
  <account-select-dialog v-model="dialogVisible"
                         :validate="validate"
                         @account-selected="account => modelValue = account" />

  <!-- Field -->
  <q-field :model-value="modelValue"
           :label="label"
           readonly
           borderless
           stack-label
           dense>
    <!-- Template: Select Button -->
    <template #before>
      <!-- Select Button -->
      <button-icon size="sm" icon="person_search" @click="dialogVisible = true" />
    </template>
    <!-- Template: Account Name -->
    <template #control>
      <!-- Account Name -->
      {{ modelValue ? modelValue.getName() : '' }}
    </template>
  </q-field>
</template>

<style scoped lang="scss">
.q-field--filled.q-field--readonly .q-field__control:before {
  border-bottom-width: 0;
}
</style>

<script setup lang="ts">
import { Account } from 'src/scripts/firestore/account';
import { computed, ref } from 'vue';
import AccountSelectDialog from 'components/app/AccountSelectDialog.vue';
import ButtonIcon from 'components/common/ButtonIcon.vue';

// Defines the properties of this component.
const props = defineProps<{
  // The model value
  modelValue: Account | null;
  // The label of this field
  label: string;
  // Validator
  validate?: (account: Account) => string | null;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Model value has changed
  (event: 'update:modelValue', value: Account | null): void;
}>();

// Computed model value
const modelValue = computed({
  get: () => props.modelValue,
  set: (value: Account | null) => emit('update:modelValue', value)
});

// Dialog Visibility
const dialogVisible = ref(false);

</script>
