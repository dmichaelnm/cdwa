<template>
  <!-- Footer -->
  <q-footer class="app-footer">
    <!-- Footer DIV -->
    <div>
      <!-- Footer Row -->
      <div class="row items-center">
        <!-- Left Footer Column -->
        <div class="col-4 text-left">
          <!-- Left Footer Slot -->
          <slot name="left" />
        </div>
        <!-- Center Footer Column -->
        <div class="col-4 text-center">
          <!-- Center Footer Slot -->
          <slot name="center" />
        </div>
        <!-- Right Footer Column -->
        <div class="col-4 text-right">
          <!-- Right Footer Slot -->
          <slot name="right" />
        </div>
      </div>
    </div>
  </q-footer>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.app-footer {
  padding: 4px;
  background-color: $light-background-0;
}

.body--dark .app-footer {
  background-color: $dark-background-0;
}
</style>
