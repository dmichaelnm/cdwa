<template>
  <!-- Authentication Frame -->
  <auth-frame :message="$t('auth.login.message')">
    <!-- Login Form -->
    <q-form>
      <!-- Login DIV -->
      <div class="login-page q-col-gutter-y-md">

        <!-- Email & Password Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Email Column -->
          <div class="col">
            <!-- Email Input -->
            <field-input v-model="email"
                         :label="$t('auth.label.email')"
                         :auto-focus="email === ''"
                         auto-complete="username" />
          </div>
          <!-- Password Column -->
          <div class="col">
            <!-- Password Input -->
            <field-input v-model="password"
                         :label="$t('auth.label.password')"
                         :auto-focus="email !== ''"
                         auto-complete="current-password"
                         type="password" />
          </div>
        </div>

        <!-- Login Button Row -->
        <div class="row">
          <!-- Login Button Column -->
          <div class="col text-center">
            <!-- Login Button -->
            <button-push :label="$t('auth.button.login')" />
          </div>
        </div>

        <!-- Register & Password Reset Button Row -->
        <div class="row">
          <!-- Register Button Column -->
          <div class="col text-center">
            <!-- Register Button -->
            <button-push :label="$t('auth.button.register')"
                         size="sm"
                         flat />
          </div>
          <!-- Password Reset Button Column -->
          <div class="col text-center">
            <!-- Password Reset Button -->
            <button-push :label="$t('auth.button.reset')"
                         size="sm"
                         flat />
          </div>
        </div>

      </div>
    </q-form>
  </auth-frame>
</template>

<style scoped lang="scss">

.login-page {
  padding: 16px;
}
</style>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import AuthFrame from 'components/auth/AuthFrame.vue';
import FieldInput from 'components/common/FieldInput.vue';
import { Logging } from 'src/scripts/util/logging';
import { useComposables } from 'src/scripts/util/composables';
import ButtonPush from 'components/common/ButtonPush.vue';

// Composable
const cmp = useComposables();

// Email Address
const email = ref('');
// Password
const password = ref('');

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('LoginPage#onBeforeMount');
  // Initialize email address with the content from the cookie
  email.value = cmp.quasar.cookies.get('email');
});

</script>
