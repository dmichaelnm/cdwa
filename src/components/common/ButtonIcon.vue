<template>
  <!-- Button -->
  <q-btn :icon="icon"
         :size="size"
         :href="href"
         :target="target"
         :dense="dense"
         :flat="!highlighted"
         :class="classAttr"
         :disable="disabled"
         round
         @click="emit('click')">
    <!-- Default Slot -->
    <slot />
    <!-- Tooltip -->
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.button-icon {
  color: $light-text;
}

.body--dark .button-icon {
  color: $dark-text;
}

.button-icon-highlighted {
  color: $primary;
}

.button-icon-disabled {
  color: $dark-text;
}

.body--dark .button-icon-disabled {
  color: $light-text;
}

</style>

<script setup lang="ts">
import { computed } from 'vue';

// Defines the properties of this component.
const props = defineProps<{
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
  // An optional tooltip text
  tooltip?: string;
  // Flag controlling whether this button is disabled
  disabled?: boolean;
}>();

// Computed class attribute
const classAttr = computed(() => {
  if (props.disabled) {
    return 'button-icon-disabled';
  }
  if (props.highlighted) {
    return 'button-icon-highlighted';
  }
  return 'button-icon';
});

// Define the events emitted by this component.
const emit = defineEmits<{
  // Click event
  (event: 'click'): void;
}>();

</script>
