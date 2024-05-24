<template>
  <!-- Connection Properties Frame -->
  <connection-properties-frame :properties="properties"
                               :application="EConnectionApplication.snowflake"
                               :readonly="readonly">
    <!-- Account Credentials Row -->
    <div class="row q-col-gutter-x-md">
      <!-- Account Column -->
      <div class="col-4">
        <!-- Account Input -->
        <field-input v-model="properties.account"
                     :label="$t('connection.label.account')"
                     :readonly="readonly"
                     mandatory />
      </div>
      <!-- Username Column -->
      <div class="col-4">
        <!-- Username Input -->
        <field-input v-model="properties.username"
                     :label="$t('connection.label.username')"
                     :readonly="readonly"
                     auto-complete="username"
                     upper-case
                     mandatory />
      </div>
      <!-- Password Column -->
      <div class="col-4">
        <!-- Password Input -->
        <field-input v-model="properties.password"
                     :label="$t('connection.label.password')"
                     :readonly="readonly"
                     auto-complete="current-password"
                     type="password"
                     mandatory />
      </div>
    </div>
    <!-- Properties Row -->
    <div class="row q-col-gutter-x-md">
      <!-- Database Column -->
      <div class="col-4">
        <!-- Database Input -->
        <field-input v-model="properties.database"
                     :label="$t('connection.label.database')"
                     :readonly="readonly"
                     upper-case />
      </div>
      <!-- Warehouse Column -->
      <div class="col-4">
        <!-- Warehouse Input -->
        <field-input v-model="properties.warehouse"
                     :label="$t('connection.label.warehouse')"
                     :readonly="readonly"
                     upper-case />
      </div>
      <!-- Role Column -->
      <div class="col-4">
        <!-- Role Input -->
        <field-input v-model="properties.role"
                     :label="$t('connection.label.role')"
                     :readonly="readonly"
                     upper-case />
      </div>
    </div>
  </connection-properties-frame>
</template>

<script setup lang="ts">
import { EConnectionApplication, TConnectionPropertiesSnowflake } from 'src/scripts/firestore/connection';
import { computed } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import ConnectionPropertiesFrame from 'components/app/connection/ConnectionPropertiesFrame.vue';

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: TConnectionPropertiesSnowflake;
  // Flag controlling whether this component is readonly
  readonly?: boolean;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Model value changed
  (event: 'update:modelValue', value: TConnectionPropertiesSnowflake): void
}>();

// Properties edited by this component
const properties = computed({
  get: () => props.modelValue,
  set: newValue => emit('update:modelValue', newValue)
});

</script>
