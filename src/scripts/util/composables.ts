import { EventBus, useQuasar } from 'quasar';
import { useSessionStore } from 'stores/session-store';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { inject, Ref, ref } from 'vue';
import { Logging } from 'src/scripts/util/logging';
import { TMessageDialogOptions } from 'src/scripts/util/types';
import { Timestamp } from 'firebase/firestore';

const messageDialogOptions = ref<TMessageDialogOptions>({
  title: '',
  message: '',
  details: null,
  color: null,
  buttons: ['close'],
  callback: null,
  visible: false
});

/**
 * Returns an object with methods to display message dialogs and success dialogs.
 * The returned object has the following properties:
 * - messageDialogOptions: A ref to a TMessageDialogOptions object.
 * - showMessageDialog: A method to display a message dialog with the specified title, message, details, color, and callback.
 * - showSuccessDialog: A method to display a success dialog with the specified title, message, details, and callback.
 *
 * @return {object} An object with methods to display message dialogs and success dialogs.
 */
export function useMessageDialog(): {
  messageDialogOptions: Ref<TMessageDialogOptions>,
  /**
   * Displays a dialog box with the specified title, message, and optional details, color and callback.
   *
   * @param {string} title - The title of the dialog box.
   * @param {string} message - The message to display in the dialog box.
   * @param {string} [details] - Optional details to provide additional information in the dialog box.
   * @param {string} [color] - Optional color to style the dialog box.
   * @param {(value: string) => boolean} [callback] - Optional callback function to handle user interaction with the dialog box.
   *                                                 Accepts a value parameter and should return a boolean value.
   *                                                 If true is returned, the dialog box will close. If false is returned,
   *                                                 the dialog box will not close.
   *                                                 If no callback function is provided, the dialog box will close when the
   *                                                 user clicks the Close button.
   *
   * @returns {void}
   */
  showMessageDialog: (
    title: string,
    message: string,
    details?: string,
    color?: string,
    callback?: (value?: string) => boolean | void
  ) => void,
  /**
   * Displays a success dialog with the given title, message, details, and an optional callback function.
   *
   * @param {string} title - The title of the success dialog.
   * @param {string} message - The main message of the success dialog.
   * @param {string} [details] - Additional details to be displayed in the success dialog. Defaults to null.
   * @param {Function} [callback] - An optional callback function that will be called when the success dialog is
   *        closed. The function should accept a single string parameter and return a boolean value.
   *
   * @returns {void}
   */
  showSuccessDialog: (
    title: string,
    message: string,
    details?: string,
    callback?: (value?: string) => boolean | void
  ) => void
} {
  return {
    messageDialogOptions: messageDialogOptions,
    showMessageDialog: (
      title: string,
      message: string,
      details?: string,
      color?: string,
      callback?: (value?: string) => boolean | void
    ) => {
      messageDialogOptions.value.title = title;
      messageDialogOptions.value.message = message;
      messageDialogOptions.value.details = details ? details : null;
      messageDialogOptions.value.color = color ? color : null;
      messageDialogOptions.value.buttons = ['close'];
      messageDialogOptions.value.callback = callback ? callback : null;
      messageDialogOptions.value.visible = true;
    },
    showSuccessDialog: (
      title: string,
      message: string,
      details?: string,
      callback?: (value?: string) => boolean | void
    ): void => {
      messageDialogOptions.value.title = title;
      messageDialogOptions.value.message = message;
      messageDialogOptions.value.details = details ? details : null;
      messageDialogOptions.value.color = '#448753';
      messageDialogOptions.value.buttons = ['close'];
      messageDialogOptions.value.callback = callback ? callback : null;
      messageDialogOptions.value.visible = true;
    }
  };
}

/**
 * Returns a function that formats a timestamp object into a string representation.
 *
 * @return {function(tmsp: Timestamp|null): string} - The function that formats the timestamp.
 */
export function useFormatTimestamp(): (tmsp: Timestamp | null | undefined) => string {
  // Get composables
  const cmp = useComposables();
  // Return the function
  return (tmsp: Timestamp | null | undefined) => {
    if (tmsp) {
      // Returns the formatted timestamp
      return tmsp.toDate().toLocaleString(cmp.sessionStore.accountActive.data.preferences.uiLanguage);
    }
    return '';
  };
}

/**
 * A reusable hook that wraps a task execution function and provides error handling and l
 * oading screen functionality.
 *
 * @returns {Function} The wrapped task execution function.
 */
export function useRunTask(): (
  task: () => Promise<boolean | void>,
  errorHandler?: (error: unknown) => boolean
) => Promise<boolean> {
  // Get composables
  const cmp = useComposables();
  // Get message dialog composable
  const { showMessageDialog } = useMessageDialog();
  // Return the composable
  return (
    task: () => Promise<boolean | void>,
    errorHandler?: (error: unknown) => boolean
  ) => new Promise((resolve) => {
    // Lock the screen
    cmp.quasar.loading.show({ delay: 0 });
    // Run the task handler and return the result
    task()
      // Process result of the task
      .then(result => {
        // Return task execution result
        resolve(typeof result === 'boolean' ? result as boolean : true);
      })
      // Process error
      .catch(error => {
        // Log the error
        Logging.error(error);
        let errorProcessed = false;
        // Call the custom error handler, if specified
        if (errorHandler) {
          errorProcessed = errorHandler(error);
        }
        // If error was not processed, show unexpected error dialog
        if (!errorProcessed) {
          showMessageDialog(
            cmp.i18n.t('dialog.unexpected.title'),
            cmp.i18n.t('dialog.unexpected.message'),
            JSON.stringify(error),
            '#ca6570'
          );
        }
        // Task was not successful
        resolve(false);
      })
      .finally(() => {
        // Unlock the screen
        cmp.quasar.loading.hide();
      });
  });
}

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
    sessionStore: useSessionStore(),
    bus: inject('bus') as EventBus
  };
}
