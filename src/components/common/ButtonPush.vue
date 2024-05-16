<template>
  <!-- Button -->
  <q-btn :label="label"
         :flat="flat"
         :size="size"
         :to="to"
         :type="type"
         no-caps
         dense
         @click="emit('click')">
    <!-- Default Slot -->
    <slot />
  </q-btn>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.q-btn {
  color: $light-button-text;
  background-color: $light-button-background;
}

.q-btn--flat {
  color: $light-button-background;
  background-color: transparent;
}

.q-btn--dense {
  padding: 0 16px;
}
</style>

<script setup lang="ts">

// Defines the properties of this component.
defineProps<{
  // Label of the button
  label: string;
  // Flag controlling whether this button is flat
  flat?: boolean;
  // The size of the button
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Path route to when clicking the button
  to?: string;
  // The type of the button
  type?: 'button' | 'submit';
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Click Event
  (event: 'click'): void;
}>();

</script>
