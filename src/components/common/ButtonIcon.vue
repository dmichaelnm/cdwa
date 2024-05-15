<template>
  <!-- Button -->
  <q-btn :icon="icon"
         :size="size"
         :href="href"
         :target="target"
         round
         flat
         @click="emit('click')">
    <!-- Default Slot -->
    <slot />
  </q-btn>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">

// Defines the properties of this component.
defineProps<{
  // The icon of this button
  icon: string;
  // The size of this button
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // HRef attribute for external links
  href?: string;
  // Target of an external link
  target?: '_blank' | '_self';
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Click event
  (event: 'click'): void;
}>();

</script>
