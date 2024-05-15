import { useQuasar } from 'quasar';
import { useSessionStore } from 'stores/session-store';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

/**
 * Returns an object with various composable functions.
 *
 * An object containing the following composable functions:
 *   - i18n: The useI18n() function from the Vue i18n library.
 *   - quasar: The useQuasar() function from the Quasar framework.
 *   - route: The useRoute() function from Vue Router.
 *   - router: The useRouter() function from Vue Router.
 *   - sessionStore: The useSessionStore() function for managing session data.
 */
export function useComposables() {
  return {
    i18n: useI18n(),
    quasar: useQuasar(),
    route: useRoute(),
    router: useRouter(),
    sessionStore: useSessionStore()
  };
}
