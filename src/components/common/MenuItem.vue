<template>
  <!-- Item -->
  <q-item v-close-popup="closable ? closable : false"
          dense
          :clickable="clickable"
          @click="emit('click')">
    <!-- Icon Section -->
    <q-item-section side v-if="showIcon">
      <!-- Icon -->
      <q-icon :name="icon" size="xs" />
    </q-item-section>
    <!-- Label Section -->
    <q-item-section>
      <!-- Label -->
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
    <!-- Sub Menu Slot -->
    <slot />
  </q-item>
</template>

<script setup lang="ts">

// Defines the properties of this component.
defineProps<{
  // The label of the menu item
  label: string;
  // Flag controlling whether this menu item is clickable
  clickable?: boolean;
  // Flag controlling whether this menu item is closable
  closable?: boolean;
  // Flag controlling whether the icon section is visible
  showIcon?: boolean;
  // The icon to be shown of the left side
  icon?: string;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Click event
  (event: 'click'): void;
}>();

</script>
