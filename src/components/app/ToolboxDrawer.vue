<template>
  <!-- Main DIV -->
  <div>
    <!-- Search Field Row -->
    <div class="row">
      <!-- Search Field Column -->
      <div class="col">
        <!-- Search Field -->
        <field-input v-model="searchFilter"
                     :label="$t('label.filter')"
                     squared />
      </div>
    </div>
    <!-- Expansions Row -->
    <div class="row">
      <!-- Expansions Column -->
      <div class="col">

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import FieldInput from 'components/common/FieldInput.vue';
import { ref } from 'vue';

// Composable
const cmp = useComposables();

// Search Filter
const searchFilter = ref('');

</script>
