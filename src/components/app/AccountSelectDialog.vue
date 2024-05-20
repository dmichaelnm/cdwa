<template>
  <!-- Dialog -->
  <basic-dialog ref="dialog"
                v-model="visiblity"
                :title="$t('dialog.accountSelect.title')"
                :message="$t('dialog.accountSelect.message')"
                :form="form"
                :submit="submit"
                @before-show="resetDialog">

    <!-- Form -->
    <q-form ref="form"
            @submit="dialog?.onSubmit()">
      <field-input v-model="email"
                   :label="$t('auth.label.email')"
                   :error="emailError"
                   mandatory
                   auto-focus />
    </q-form>

  </basic-dialog>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import BasicDialog from 'components/common/BasicDialog.vue';
import { computed, ref } from 'vue';
import FieldInput from 'components/common/FieldInput.vue';
import { QForm } from 'quasar';
import { Account } from 'src/scripts/firestore/account';
import { useComposables } from 'src/scripts/util/composables';

// Composables
const cmp = useComposables();

// Dialog reference
const dialog = ref<typeof BasicDialog | null>(null);
// Form reference
const form = ref<QForm | null>(null);

// Defines the properties of this component.
const props = defineProps<{
  // Model value
  modelValue: boolean;
  // Validator
  validate?: (account: Account) => string | null;
}>();

// Define the events emitted by this component.
const emit = defineEmits<{
  // Event when account was selected
  (event: 'accountSelected', account: Account): void;
  // Model value changed
  (event: 'update:modelValue', value: boolean): void;
}>();

// Computed model value
const visiblity = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});

// Email Address & Error
const email = ref('');
const emailError = ref('');

/**
 * Called when the form is submitted. Retrieves the account for the email address, validates the account and emits an
 * event.
 *
 * @returns {Promise<boolean>} Returns a promise that resolves to a boolean indicating whether the submit operation was successful.
 */
async function submit(): Promise<boolean> {
  // Try to load the account by its email address
  const account = await Account.findAccount(email.value);
  // Check, if account was found
  if (account === null) {
    // Unknown email address
    emailError.value = cmp.i18n.t('dialog.accountSelect.error.emailUnknown');
    return false;
  }
  // Validate the account
  if (props.validate) {
    const error = props.validate(account);
    if (error) {
      // Validation failed
      emailError.value = error;
      return false;
    }
  }
  // Send event
  emit('accountSelected', account);
  // Account validated, return true
  return true;
}

/**
 * Resets the dialog by clearing the input fields and resetting validation.
 *
 * @return {void}
 */
function resetDialog(): void {
  form.value?.resetValidation();
  email.value = '';
  emailError.value = '';
}

</script>
