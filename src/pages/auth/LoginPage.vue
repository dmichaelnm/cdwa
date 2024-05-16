<template>
  <!-- Authentication Frame -->
  <auth-frame :message="$t('auth.login.message')">
    <!-- Login Form -->
    <q-form ref="form"
            @submit="login">
      <!-- Login DIV -->
      <div class="login-page q-col-gutter-y-md">

        <!-- Email & Password Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Email Column -->
          <div class="col">
            <!-- Email Input -->
            <field-input v-model="email"
                         :label="$t('auth.label.email')"
                         :error="emailError"
                         :auto-focus="email === ''"
                         mandatory
                         auto-complete="username" />
          </div>
          <!-- Password Column -->
          <div class="col">
            <!-- Password Input -->
            <field-input v-model="password"
                         :label="$t('auth.label.password')"
                         :error="passwordError"
                         :auto-focus="email !== ''"
                         auto-complete="current-password"
                         type="password"
                         mandatory />
          </div>
        </div>

        <!-- Login Button Row -->
        <div class="row">
          <!-- Login Button Column -->
          <div class="col text-center">
            <!-- Login Button -->
            <button-push :label="$t('auth.button.login')"
                         type="submit" />
          </div>
        </div>

        <!-- Register & Password Reset Button Row -->
        <div class="row">
          <!-- Register Button Column -->
          <div class="col text-center">
            <!-- Register Button -->
            <button-push :label="$t('auth.button.register')"
                         size="sm"
                         flat
                         to="/auth/register" />
          </div>
          <!-- Password Reset Button Column -->
          <div class="col text-center">
            <!-- Password Reset Button -->
            <button-push :label="$t('auth.button.reset')"
                         size="sm"
                         flat
                         to="/auth/reset" />
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
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import AuthFrame from 'components/auth/AuthFrame.vue';
import FieldInput from 'components/common/FieldInput.vue';
import { Logging } from 'src/scripts/util/logging';
import { useComposables, useRunTask } from 'src/scripts/util/composables';
import ButtonPush from 'components/common/ButtonPush.vue';
import * as tp from 'src/scripts/util/types';
import { QForm } from 'quasar';
import { processFirebaseError } from 'src/scripts/util/firebase';
import { Account } from 'src/scripts/firestore/account';

// Composable
const cmp = useComposables();
const runTask = useRunTask();

// Form reference
const form = ref<QForm | null>(null);

// Email Address & Error
const email = ref('');
const emailError = ref('');
// Password & Error
const password = ref('');
const passwordError = ref('');

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('LoginPage#onBeforeMount');
  // Initialize email address with the content from the cookie
  email.value = cmp.quasar.cookies.get('email');

  // Register event of changing the UI language
  cmp.bus.on(tp.EGlobalEvent.languageChanged, () => {
    // Reset error messages
    resetErrorMessages();
  });
});

/**
 * Lifecycle event method called before this component is unmounted.
 */
onBeforeUnmount(() => {
  Logging.debug('LoginPage#onBeforeUnmount');
  // Deregister all listeners
  cmp.bus.off(tp.EGlobalEvent.languageChanged);
});

/**
 * Resets the error messages for email and password fields.
 *
 * @returns {void}
 */
function resetErrorMessages(): void {
  form.value?.resetValidation();
  emailError.value = '';
  passwordError.value = '';
}

/**
 * Logs in the user to the application.
 *
 * @return {Promise<void>} A promise that resolves when the login process is complete.
 */
async function login(): Promise<void> {
  // Reset error messages
  resetErrorMessages();
  // Start the login process
  await runTask(
    async () => {
      // Login to firebase
      await Account.login(email.value, password.value);
      // Set email cookie
      cmp.quasar.cookies.set('email', email.value, { expires: 365 });
      // Route to main page
      await cmp.router.push({ path: '/' });
    },
    (error) => {
      // Process error
      return processFirebaseError(
        cmp.i18n.t,
        error,
        emailError,
        passwordError
      );
    });
}

</script>
