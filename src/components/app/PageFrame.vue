<template>
  <!-- Page -->
  <q-page class="page">
    <!-- Page DIV -->
    <div>
      <!-- Row -->
      <div class="row" style="padding: 32px">
        <!-- Left Empty Column -->
        <div class="col-1" />
        <!-- Frame Column -->
        <div class="col-10 page-frame">
          <!-- Frame DIV -->
          <div class="q-col-gutter-y-md">
            <!-- Title & Frame Button Row -->
            <div class="row items-center">
              <!-- Title Column -->
              <div class="col-8 page-frame-title">{{ title }}</div>
              <!-- Frame Buttons Column -->
              <div class="col-4 text-right q-gutter-x-md">
                <!-- Frame Buttons Slot -->
                <slot name="buttons" />
              </div>
            </div>

            <!-- Frame Message Row -->
            <div class="row">
              <!-- Frame Message Column -->
              <div class="col-8">{{ message }}</div>
            </div>

            <!-- Content Row -->
            <div class="row">
              <!-- Content Column -->
              <div class="col">
                <!-- Default Slot -->
                <slot />
              </div>
            </div>

          </div>
        </div>
        <!-- Right Empty Column -->
        <div class="col-1" />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.page {
  box-shadow: inset 0 0 10px 0 $light-shadow-0;
}

.body--dark .page {
  box-shadow: inset 0 0 10px 0 $dark-shadow;
}

.page-frame {
  padding: 16px;
  background-color: $light-background-0;
  box-shadow: 0 0 10px 0 $light-shadow-0;
}

.body--dark .page-frame {
  background-color: $dark-background-0;
  box-shadow: 0 0 10px 0 $dark-shadow;
}

.page-frame-title {
  font-size: 12pt;
  font-variant: petite-caps;
  font-weight: bold;
}
</style>

<script setup lang="ts">

// Defines the properties of this component.
defineProps<{
  // Title of this page frame
  title: string;
  // Message of this page frame
  message: string;
}>();

</script>
