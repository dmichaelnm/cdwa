<template>
  <!-- Connection Properties Frame -->
  <connection-properties-frame :properties="properties"
                               :application="EConnectionApplication.s3"
                               :readonly="readonly">
    <!-- Properties Row -->
    <div class="row q-col-gutter-x-md">
      <!-- Region Column -->
      <div class="col-3">
        <!-- Region Selection -->
        <field-select v-model="properties.region"
                      :label="$t('connection.label.region')"
                      :options="getAWSRegions()"
                      :readonly="readonly" />
      </div>
      <!-- Bucket Column -->
      <div class="col-3">
        <!-- Bucket Input -->
        <field-input v-model="properties.bucket"
                     :label="$t('connection.label.bucket')"
                     :readonly="readonly"
                     auto-complete="username"
                     mandatory />
      </div>
      <!-- Access Key ID Column -->
      <div class="col-3">
        <!-- Access Key ID Input -->
        <field-input v-model="properties.accessKeyId"
                     :label="$t('connection.label.accessKeyId')"
                     :readonly="readonly"
                     auto-complete="current-password"
                     type="password"
                     mandatory />
      </div>
      <!-- Secret Access Key Column -->
      <div class="col-3">
        <!-- Secret Access Key Input -->
        <field-input v-model="properties.secretAccessKey"
                     :label="$t('connection.label.secretAccessKey')"
                     :readonly="readonly"
                     auto-complete="current-password"
                     type="password"
                     mandatory />
      </div>
    </div>
  </connection-properties-frame>
</template>

<script setup lang="ts">
import { EConnectionApplication, TConnectionPropertiesS3 } from 'src/scripts/firestore/connection';
import { computed } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { getAWSRegions } from 'src/scripts/config/options';
import ConnectionPropertiesFrame from 'components/app/connection/ConnectionPropertiesFrame.vue';

// Defines the properties of this component.
const props = defineProps<{
  // Model Value
  modelValue: TConnectionPropertiesS3;
  // Flag controlling whether this component is readonly
  readonly?: boolean;
}>();

// Defines the events emitted by this component.
const emit = defineEmits<{
  // Model value changed
  (event: 'update:modelValue', value: TConnectionPropertiesS3): void
}>();

// Properties edited by this component
const properties = computed({
  get: () => props.modelValue,
  set: newValue => emit('update:modelValue', newValue)
});

</script>
