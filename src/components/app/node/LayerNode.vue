<template>
  <!-- Basic Node -->
  <basic-node :document="document"
              node-class="layer-node"
              :icon="getLayerTypeOptions().find(l => l.value === document.data.type)?.icon">
    <!-- Layer Title -->
    <div class="layer-title">{{ document.data.common.name }}</div>
    <!-- Layer Description -->
    <div class="layer-description">{{ document.data.common.description }}</div>
  </basic-node>
</template>

<style lang="scss">
@import "src/css/quasar.variables";

$layer-main-light: #C0C0C0;
$layer-main-dark: #606060;

.layer-node {
  color: $layer-main-light;
  background-color: $light-background-0;
  border: 1px dashed $layer-main-light;
}

.body--dark .layer-node {
  color: $layer-main-dark;
  background-color: $dark-background-2;
  border: 1px dashed $layer-main-dark;
}

.layer-title {
  font-size: 10pt;
  font-weight: bold;
}

.layer-description {
  font-size: 8pt;
}
</style>

<script setup lang="ts">
import BasicNode from 'components/app/node/BasicNode.vue';
import { getLayerTypeOptions, Layer } from 'src/scripts/firestore/layer';

// Defines the properties of this component.
defineProps<{
  // Document
  document: Layer;
}>();

</script>
