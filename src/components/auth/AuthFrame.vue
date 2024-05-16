<template>
  <!-- Page -->
  <q-page class="flex flex-center">
    <!-- Frame DIV -->
    <div class="frame auth-frame q-col-gutter-y-md">

      <!-- Header Row -->
      <div class="row">
        <!-- Header Column -->
        <div class="col">
          <!-- Title Row -->
          <div class="row">
            <!-- Title Column -->
            <div class="col auth-title">{{ $t('application.title') }}</div>
          </div>
          <!-- Copyright Row -->
          <div class="row">
            <!-- Copyright Column -->
            <div class="col auth-hint"><span v-html="$t('application.copyright')" /></div>
          </div>
          <!-- Version Row -->
          <div class="row">
            <!-- Version Column -->
            <div class="col auth-hint">{{ $t('application.version', {
              major: version.major,
              minor: version.minor,
              patch: version.patch,
              env: version.environment,
              build: version.build
            }) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Message Row -->
      <div class="row">
        <!-- Message Column -->
        <div class="col auth-message">{{ message }}</div>
      </div>

      <!-- Page Row -->
      <div class="row">
        <!-- Page Column -->
        <div class="col">
          <!-- Page Slot -->
          <slot />
        </div>
      </div>

      <!-- Options Row -->
      <div class="row">
        <!-- UI Mode Column -->
        <div class="col-8">
          <!-- UI Mode Icon -->
          <button-icon size="md" :icon="uiModeIcon" @click="switchUIMode" />
        </div>
        <!-- Language Selection Column -->
        <div class="col-4">
          <!-- Language Selection -->
          <field-select v-model="languageCode"
                        :options="getLanguageOptions()"
                        option-icon-size="xs"
                        show-icons
                        borderless
                        translate
                        @update:modelValue="switchUILanguage" />
        </div>
      </div>

    </div>
  </q-page>
</template>

<style scoped lang="scss">
@import "src/css/quasar.variables";

.auth-frame {
  width: 550px;
  padding: 32px;
}

.auth-title {
  text-align: center;
  font-size: 16pt;
  font-variant: petite-caps;
  color: $light-text-strong;
}

.body--dark .auth-title {
  color: $dark-text-strong;
}

.auth-hint {
  text-align: center;
  font-size: 8pt;
  color: $light-text-hint;
}

.body--dark .auth-hint {
  color: $dark-text-hint;
}

.auth-message {
  text-align: center;
  padding: 0 16px;
}

</style>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { version } from 'src/scripts/config/version';
import { useComposables } from 'src/scripts/util/composables';
import { EGlobalEvent, EUILanguage, EUIMode } from 'src/scripts/util/types';
import { getLanguageOptions } from 'src/scripts/config/options';
import ButtonIcon from 'components/common/ButtonIcon.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { Logging } from 'src/scripts/util/logging';

// Composable
const cmp = useComposables();

// Defines the properties of this component.
defineProps<{
  // Authentication Page Message
  message: string;
}>();

// Selected Language Code
const languageCode = ref(EUILanguage.enUS);

// Computed UI mode icon
const uiModeIcon = computed(() => {
  return cmp.quasar.dark.isActive ? 'light_mode' : 'dark_mode';
});

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  Logging.debug('AuthFrame#onBeforeMount');
  // Set UI mode
  const mode = cmp.quasar.cookies.get('ui-mode');
  cmp.quasar.dark.set(mode === EUIMode.dark);
  // Set UI Language
  languageCode.value = getDefaultLanguageCode();
  cmp.i18n.locale.value = languageCode.value;
});

/**
 * Switches the UI mode between dark and light.
 *
 * This method toggles the UI mode between dark and light by invoking the appropriate
 * functions. It also sets a cookie to remember the selected UI mode.
 *
 * @return {void}
 */
function switchUIMode(): void {
  // Switch the UI mode
  cmp.quasar.dark.set(!cmp.quasar.dark.isActive);
  // Set the UI mode cookie
  cmp.quasar.cookies.set(
    'ui-mode',
    cmp.quasar.dark.isActive ? EUIMode.dark : EUIMode.light,
    { expires: 365 }
  );
}

/**
 * Switches the UI language and sets the language cookie.
 *
 * @return {void}
 */
function switchUILanguage(): void {
  // Switch the UI language
  cmp.i18n.locale.value = languageCode.value;
  // Set the UI language cookie
  cmp.quasar.cookies.set(
    'language',
    languageCode.value,
    { expires: 365 }
  );
  // Send global event
  cmp.bus.emit(EGlobalEvent.languageChanged, languageCode.value);
}

/**
 * Retrieves the default language code either from a cookie or from the browser.
 *
 * @return {EUILanguage} The default language code.
 */
function getDefaultLanguageCode(): EUILanguage {
  // Valid language options
  const options = getLanguageOptions();
  // Language from cookie
  let language = cmp.quasar.cookies.get('language');
  if (options.some(opt => opt.value === language)) {
    // Found valid option
    return language as EUILanguage;
  }
  // Language from browser
  language = navigator.language;
  if (options.some(opt => opt.value === language)) {
    // Found valid option
    return language as EUILanguage;
  }
  // Return english as default
  return EUILanguage.enUS;
}

</script>
