<template>
  <!-- Authentication Frame -->
  <auth-frame :message="$t('auth.reset.message')">
    <!-- Reset Password Form -->
    <q-form ref="form"
            @submit="resetPassword">
      <!-- Reset Password DIV -->
      <div class="login-page q-col-gutter-y-md">

        <!-- Email Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Email Column -->
          <div class="col">
            <!-- Email Input -->
            <field-input v-model="email"
                         :label="$t('auth.label.email')"
                         :error="emailError"
                         auto-focus
                         mandatory />
          </div>
        </div>

        <!-- Reset Password Button Row -->
        <div class="row">
          <!-- Reset Password Button Column -->
          <div class="col text-center">
            <!-- Reset Password Button -->
            <button-push :label="$t('auth.button.reset')"
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

</style>

<script setup lang="ts">
import { useComposables, useMessageDialog, useRunTask } from 'src/scripts/util/composables';
import AuthFrame from 'components/auth/AuthFrame.vue';
import FieldInput from 'components/common/FieldInput.vue';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { Logging } from 'src/scripts/util/logging';
import ButtonPush from 'components/common/ButtonPush.vue';
import * as tp from 'src/scripts/util/types';
import { QForm } from 'quasar';
import { processFirebaseError } from 'src/scripts/util/firebase';
import { Account } from 'src/scripts/firestore/account';

// Composable
const cmp = useComposables();
const runTask = useRunTask();
const { showSuccessDialog } = useMessageDialog();

// Form reference
const form = ref<QForm | null>(null);

// Email Address & Error
const email = ref('');
const emailError = ref('');

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('ResetPage#onBeforeMount');
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
  Logging.debug('ResetPage#onBeforeUnmount');
  // Deregister all listeners
  cmp.bus.off(tp.EGlobalEvent.languageChanged);
});

/**
 * Resets the error messages in the form and email error variables.
 *
 * @returns {void}
 */
function resetErrorMessages(): void {
  form.value?.resetValidation();
  emailError.value = '';
}

/**
 * Resets the password for the user.
 *
 * @return {Promise<void>} A promise that resolves when the password reset process is complete.
 */
async function resetPassword(): Promise<void> {
  // Reset error messages
  resetErrorMessages();
  // Start the reset password process
  await runTask(
    async () => {
      // Request password reset email
      await Account.resetPassword(email.value);
      // Set email cookie
      cmp.quasar.cookies.set(tp.ECookie.email, email.value, { expires: 365 });
      // Show success dialog
      showSuccessDialog(
        cmp.i18n.t('auth.reset.dialog.title'),
        cmp.i18n.t('auth.reset.dialog.message'),
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
        emailError
      );
    });
}

</script>
