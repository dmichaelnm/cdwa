import { EventBus, useQuasar } from 'quasar';
import { useSessionStore } from 'stores/session-store';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { inject, Ref, ref } from 'vue';
import { Logging } from 'src/scripts/util/logging';
import { EDocumentType, EEditorMode, TMessageDialogOptions } from 'src/scripts/util/types';
import { Timestamp } from 'firebase/firestore';
import { firebaseAuth } from 'src/scripts/util/firebase';
import { globalConfig } from 'src/scripts/config/global-config';
import { httpClient } from 'boot/axios';
import { EConnectionApplication, TConnectionProperties } from 'src/scripts/firestore/connection';

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
    callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
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
    callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
  ) => void,
  /**
   * Displays an error dialog with the given title, message, details, and an optional callback function.
   *
   * @param {string} title - The title of the error dialog.
   * @param {string} message - The main message of the error dialog.
   * @param {string} [details] - Additional details to be displayed in the error dialog. Defaults to null.
   * @param {Function} [callback] - An optional callback function that will be called when the error dialog is
   *        closed. The function should accept a single string parameter and return a boolean value.
   *
   * @returns {void}
   */
  showErrorDialog: (
    title: string,
    message: string,
    details?: string,
    callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
  ) => void,
  /**
   * Displays a confirmation dialog box with the specified title, message, details,
   * and optional callback function.
   *
   * @param {string} title - The title of the confirmation dialog.
   * @param {string} message - The message shown in the body of the confirmation dialog.
   * @param {string} [details] - Additional details or information to display in the dialog.
   * @param {Function} [callback] - Optional callback function to be executed when the user clicks a button.
   *
   * @returns {void}
   */
  showConfirmationDialog: (
    title: string,
    message: string,
    details?: string,
    callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
  ) => void
} {
  return {
    messageDialogOptions: messageDialogOptions,
    showMessageDialog: (
      title: string,
      message: string,
      details?: string,
      color?: string,
      callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
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
      callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
    ): void => {
      messageDialogOptions.value.title = title;
      messageDialogOptions.value.message = message;
      messageDialogOptions.value.details = details ? details : null;
      messageDialogOptions.value.color = '#448753';
      messageDialogOptions.value.buttons = ['close'];
      messageDialogOptions.value.callback = callback ? callback : null;
      messageDialogOptions.value.visible = true;
    },
    showErrorDialog: (
      title: string,
      message: string,
      details?: string,
      callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
    ): void => {
      messageDialogOptions.value.title = title;
      messageDialogOptions.value.message = message;
      messageDialogOptions.value.details = details ? details : null;
      messageDialogOptions.value.color = '#ca6570';
      messageDialogOptions.value.buttons = ['close'];
      messageDialogOptions.value.callback = callback ? callback : null;
      messageDialogOptions.value.visible = true;
    },
    showConfirmationDialog: (
      title: string,
      message: string,
      details?: string,
      callback?: (value?: string) => boolean | void | Promise<boolean> | Promise<void>
    ): void => {
      messageDialogOptions.value.title = title;
      messageDialogOptions.value.message = message;
      messageDialogOptions.value.details = details ? details : null;
      messageDialogOptions.value.color = '#6897cf';
      messageDialogOptions.value.buttons = ['okay', 'cancel'];
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
      return tmsp.toDate().toLocaleString(cmp.sessionStore.account?.data.preferences.uiLanguage);
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
export function useRunTask(): <R>(
  task: () => Promise<any>,
  errorHandler?: (error: unknown) => boolean
) => Promise<R | undefined> {
  // Get composables
  const cmp = useComposables();
  // Get message dialog composable
  const { showMessageDialog } = useMessageDialog();
  // Return the composable
  return (
    task: () => Promise<any>,
    errorHandler?: (error: unknown) => boolean
  ) => new Promise((resolve) => {
    // Lock the screen
    cmp.quasar.loading.show({ delay: 250 });
    // Run the task handler and return the result
    task()
      // Process result of the task
      .then(result => {
        resolve(result);
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
        resolve(undefined);
      })
      .finally(() => {
        // Unlock the screen
        cmp.quasar.loading.hide();
      });
  });
}

/**
 * Returns an object with various composable functions.
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

/**
 * Returns an object with four methods for interacting with server-side cloud functions.
 */
export function useCloudFunctions(): {
  /**
   * Sends a POST request to the server with specified function name and payload.
   *
   * @param {string} functionName - The name of the server function to call.
   * @param {I} payload - The payload data to send to the server.
   *
   * @returns {Promise<O>} - Promise that resolves with the response from the server.
   *
   * @template I - The type of input data
   * @template O - The type of result data
   */
  post: <I, O>(functionName: string, payload: I) => Promise<O>,
  /**
   * Deletes a project with the given project ID.
   *
   * @param {string} projectId - The ID of the project to be deleted.
   *
   * @returns {Promise<void>} - A promise that resolves when the project is successfully deleted.
   */
  cfDeleteProject: (projectId: string) => Promise<void>,
  /**
   * Encrypts the given values using the provided key.
   *
   * @param {string} key - The encryption key.
   * @param {string[]} values - The values to be encrypted.
   *
   * @returns {Promise<string[]>} - A Promise that resolves to an array of encrypted values.
   */
  cfEncrypt: (key: string, values: string[]) => Promise<string[]>,
  /**
   * Decrypts the given values using the provided key.
   *
   * @param {string} key - The decryption key.
   * @param {string[]} values - The array of values to decrypt.
   *
   * @return {Promise<string[]>} - A Promise that resolves to an array of decrypted values.
   */
  cfDecrypt: (key: string, values: string[]) => Promise<string[]>,
  /**
   * Tests a connection to a given application using the provided properties.
   *
   * @param {EConnectionApplication} application - The application to test the connection for.
   * @param {TConnectionProperties} properties - The connection properties to use for testing.
   *
   * @returns {Promise<{ status: 'okay' | 'error', message: string }>} - The result of the connection test, which includes the status and a message.
   */
  cfTestConnection: (application: EConnectionApplication, properties: TConnectionProperties)
    => Promise<{ status: 'okay' | 'error', message: string }>
} {
  return {
    post: async <I, O>(functionName: string, payload: I): Promise<O> => {
      // Get token from current firebase user
      const token = await firebaseAuth.currentUser?.getIdToken(true);
      if (token) {
        // Get functions URL
        const functionsUrl = globalConfig.cloudFunctionsURL.replace(/:function:/g, functionName);
        // Send POST request to Firebase Functions
        const result = await httpClient.post(
          functionsUrl,
          payload,
          { headers: { 'authorization': 'Bearer ' + token } }
        );
        // Return the result data
        return result.data as O;
      }
      // No user found
      throw new Error('No authorized Firebase user found.');
    },
    cfDeleteProject: async (projectId: string): Promise<void> => {
      // Get Post function
      const { post } = useCloudFunctions();
      // Call Cloud Function "deleteProject"
      await post('deleteProject', { id: projectId });
    },
    cfEncrypt: async (key: string, values: string[]): Promise<string[]> => {
      // Get Post function
      const { post } = useCloudFunctions();
      // Call Cloud Function "encrypt"
      return await post('encrypt', {
        key: key,
        plain: values
      });
    },
    cfDecrypt: async (key: string, values: string[]): Promise<string[]> => {
      // Get Post function
      const { post } = useCloudFunctions();
      // Call Cloud Function "encrypt"
      return await post('decrypt', {
        key: key,
        encrypted: values
      });
    },
    cfTestConnection: async (application: EConnectionApplication, properties: TConnectionProperties): Promise<{
      status: 'okay' | 'error',
      message: string
    }> => {
      // Get Post function
      const { post } = useCloudFunctions();
      // Call Cloud Function "testConnection"
      return await post('testConnection', {
        application: application,
        properties: properties
      });
    }
  };
}

/**
 * Provides routing functionality for navigating between pages and opening editors.
 *
 * @returns {object} An object containing the following methods:
 *   - `openEditor`: Opens the editor for a document.
 *   - `to`: Routes to a specific path.
 */
export function useRouting(): {
  /**
   * Opens the editor for a document.
   *
   * @param {EDocumentType} type - The type of the document.
   * @param {EEditorMode} mode - The mode in which the editor should be opened.
   * @param {string} [itemId] - The ID of the item to be edited (optional).
   *
   * @returns {Promise<void>} A Promise that resolves when the editor is opened.
   */
  openEditor: (type: EDocumentType, mode: EEditorMode, itemId?: string) => Promise<void>,
  /**
   * Routes to a specific path.
   *
   * @param {string} path - The path.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is completed successfully.
   */
  to: (path: string) => Promise<void>
} {
  // Get composables
  const cmp = useComposables();
  // Get show confirm dialog
  const { showConfirmationDialog } = useMessageDialog();
  // Return the functions
  return {
    openEditor: async (type: EDocumentType, mode: EEditorMode, itemId?: string) => {
      // Lock the editor
      cmp.sessionStore.editorLock = true;
      // Set query parameter
      cmp.sessionStore.queryParams = { mode: mode, itemId: itemId };
      // Open the editor page
      await cmp.router.push({ path: `/${type}/editor` });
    },
    to: async (path: string) => {
      // Check if editor is locked
      if (cmp.sessionStore.editorLock) {
        // Show confirm dialog for discard changes
        showConfirmationDialog(
          cmp.i18n.t('dialog.discard.title'),
          cmp.i18n.t('dialog.discard.message'),
          undefined,
          (value) => {
            if (value === 'okay') {
              // Unlock editor
              cmp.sessionStore.editorLock = false;
              // Route to path
              cmp.router.push({ path: path });
            }
          }
        );
      } else {
        // Route to path
        await cmp.router.push({ path: path });
      }
    }
  };
}
