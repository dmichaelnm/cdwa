<template>
  <!-- Button -->
  <q-btn :icon="icon"
         :size="size"
         :href="href"
         :target="target"
         :dense="dense"
         round
         :flat="!highlighted"
         :color="highlighted ? 'primary' : undefined"
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
  // Flag controlling whether this button is dense
  dense?: boolean;
  // Flag controlling whether this button is highlighted
  highlighted?: boolean;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Click event
  (event: 'click'): void;
}>();

</script>
