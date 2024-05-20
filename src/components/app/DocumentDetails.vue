<template>
  <!-- Main DIV -->
  <div class="q-col-gutter-y-md">
    <!-- Label Row -->
    <div class="row details-label">
      <!-- Created By At Label Column -->
      <div class="col-3">{{ $t('label.created') }}</div>
      <!-- Altered By At Label Column -->
      <div class="col-3">{{ $t('label.altered') }}</div>
    </div>
    <!-- Created By At Value Row -->
    <div class="row">
      <!-- Created By At Value Column -->
      <div class="col-3">
        <div>{{ data.meta.created.by }}</div>
        <div>{{ formatTimestamp(data.meta.created.at) }}</div>
      </div>
      <!-- Altered By At Value Column -->
      <div class="col-3">
        <div>{{ data.meta.altered?.by }}</div>
        <div>{{ formatTimestamp(data.meta.altered?.at) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.details-label {
  font-weight: bold;
  font-variant: petite-caps;
}
</style>

<script setup lang="ts">
import { IDocumentMetaData } from 'src/scripts/firestore/firestore-document';
import { useFormatTimestamp } from 'src/scripts/util/composables';

// Format timestamp function
const formatTimestamp = useFormatTimestamp();

// Defines the properties of this component.
defineProps<{
  // The metadata part of the document data
  data: IDocumentMetaData;
}>();

</script>
