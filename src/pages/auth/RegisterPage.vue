<template>
  <!-- Authentication Frame -->
  <auth-frame :message="$t('auth.register.message')">
    <!-- Login Form -->
    <q-form ref="form"
            greedy
            @submit="registerAccount">
      <!-- Register DIV -->
      <div class="register-page q-col-gutter-y-md">

        <!-- First & Last Name Row -->
        <div class="row q-col-gutter-x-md">
          <!-- First Name Column -->
          <div class="col">
            <!-- First Name -->
            <field-input v-model="firstName"
                         :label="$t('auth.label.firstName')"
                         auto-focus
                         mandatory />
          </div>
          <!-- Last Name Column -->
          <div class="col">
            <!-- Last Name -->
            <field-input v-model="lastName"
                         :label="$t('auth.label.lastName')"
                         mandatory />
          </div>
        </div>

        <!-- Email Row -->
        <div class="row">
          <!-- Email Column -->
          <div class="col">
            <!-- Email -->
            <field-input v-model="email"
                         :label="$t('auth.label.email')"
                         :error="emailError"
                         auto-complete="username"
                         mandatory />
          </div>
        </div>

        <!-- Password & Repeat Password Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Password Column -->
          <div class="col">
            <!-- Password -->
            <field-input v-model="password"
                         :label="$t('auth.label.password')"
                         :error="passwordError"
                         auto-complete="new-password"
                         type="password"
                         mandatory />
          </div>
          <!-- Repeat Password Column -->
          <div class="col">
            <!-- Repeat Password -->
            <field-input v-model="repeatPassword"
                         :label="$t('auth.label.repeatPassword')"
                         :error="repeatPasswordError"
                         auto-complete="new-password"
                         type="password"
                         mandatory />
          </div>
        </div>

        <!-- Register Button Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Register Button Column -->
          <div class="col text-center">
            <!-- Register Button -->
            <button-push :label="$t('auth.button.register')"
                         type="submit" />
          </div>
        </div>

        <!-- Back Button Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Back Button Column -->
          <div class="col text-center">
            <!-- Back Button -->
            <button-push :label="$t('button.back')"
                         size="sm"
                         flat
                         to="/auth/login" />
          </div>
        </div>

      </div>
    </q-form>
  </auth-frame>
</template>

<style scoped lang="scss">

.register-page {
  padding: 16px;
}
</style>

<script setup lang="ts">
import { useComposables, useMessageDialog, useRunTask } from 'src/scripts/util/composables';
import AuthFrame from 'components/auth/AuthFrame.vue';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import ButtonPush from 'components/common/ButtonPush.vue';
import { Logging } from 'src/scripts/util/logging';
import * as tp from 'src/scripts/util/types';
import { QForm } from 'quasar';
import { Account } from 'src/scripts/firestore/account';
import { processFirebaseError } from 'src/scripts/util/firebase';

// Used Composables
const cmp = useComposables();
const runTask = useRunTask();
const { showSuccessDialog } = useMessageDialog();

// Form reference
const form = ref<QForm | null>(null);

// First Name
const firstName = ref('');
// Last Name
const lastName = ref('');
// Email Address & Error
const email = ref('');
const emailError = ref('');
// Password & Error
const password = ref('');
const passwordError = ref('');
// Repeat Password & Error
const repeatPassword = ref('');
const repeatPasswordError = ref('');

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('RegisterPage#onBeforeMount');
  // Initialize email address with the content from the cookie
  email.value = cmp.quasar.cookies.get(tp.ECookie.email);

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
  Logging.debug('RegisterPage#onBeforeUnmount');
  // Deregister all listeners
  cmp.bus.off(tp.EGlobalEvent.languageChanged);
});

/**
 * Resets the error messages for email, password, and repeat password fields.
 *
 * @returns {void}
 */
function resetErrorMessages(): void {
  form.value?.resetValidation();
  emailError.value = '';
  passwordError.value = '';
  repeatPasswordError.value = '';
}

/**
 * Registers a new account with the provided information.
 *
 * @returns {Promise<void>} A Promise that resolves when the registration process is complete.
 */
async function registerAccount(): Promise<void> {
  // Reset error messages
  resetErrorMessages();
  // Check Password and Repeat Password
  if (password.value !== repeatPassword.value) {
    // Different passwords, show error message on repeated password
    repeatPasswordError.value = cmp.i18n.t('auth.error.passwordsDifferent');
    return;
  }
  // Start the registration process
  await runTask(
    async () => {
      // Create the Firebase account
      await Account.createAccount(
        firstName.value,
        lastName.value,
        email.value,
        password.value,
        cmp.quasar.dark.isActive ? tp.EUIMode.dark : tp.EUIMode.light,
        cmp.i18n.locale.value as tp.EUILanguage
      );
      // Set email cookie
      cmp.quasar.cookies.set(tp.ECookie.email, email.value, { expires: 365 });
      // Show success dialog
      showSuccessDialog(
        cmp.i18n.t('auth.register.dialog.title'),
        cmp.i18n.t('auth.register.dialog.message'),
        undefined,
        () => {
          // Redirect to login page
          cmp.router.push({ path: '/auth/login' });
        });
    },
    (error) => {
      // Process error
      return processFirebaseError(
        cmp.i18n.t,
        error,
        emailError,
        passwordError
      );
    }
  );
}
</script>
