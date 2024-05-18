import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from 'src/scripts/config/firebase';
import { Assert } from 'src/scripts/util/assert';
import { Ref } from 'vue';

/**
 * A type representing a Firebase error.
 */
export type TFirebaseError = {
  // The code of the error
  code: string;
  // The message of the error
  message: string;
};

/**
 * Enum representing common error codes for Firebase operations.
 */
export enum EFirebaseErrorCode {
  // The account is locked
  authAccountLocked = 'auth/account-locked',
  // Password is too weak
  authWeekPassword = 'auth/weak-password',
  // Email is invalid
  authInvalidEmail = 'auth/invalid-email',
  // Email already in use
  authEmailAlreadyInUse = 'auth/email-already-in-use',
  // Invalid credentials
  authInvalidCredentials = 'auth/invalid-credential',
  // Too many failed requests
  authTooManyRequests = 'auth/too-many-requests'
}

/**
 * The Firebase app instance.
 */
const firebaseApp = initializeApp(firebaseConfig);

/**
 * The authentication service for the given Firebase app instance.
 */
export const firebaseAuth = getAuth(firebaseApp);

/**
 * The Firestore instance associated with a given Firebase app.
 */
export const firestore = getFirestore(firebaseApp);

/**
 * Retrieves the authorized user's name.
 *
 * @returns {string} The display name of the authorized user.
 */
export function getAuthorizedUserName(): string {
  // Be sure to have a current user
  Assert.assertValueIsSet(firebaseAuth.currentUser, 'currentUser');
  // Return the display name of the current user
  return firebaseAuth.currentUser?.displayName as string;
}

/**
 * Retrieves the ID of the authenticated user.
 *
 * @return {string} The ID of the authenticated user.
 */
export function getAuthorizedUserId(): string{
  // Be sure to have a current user
  Assert.assertValueIsSet(firebaseAuth.currentUser, 'currentUser');
  // Return the ID of the current user
  return firebaseAuth.currentUser?.uid as string;
}

/**
 * Processes a Firebase error and updates error messages accordingly.
 *
 * @param {Function} t - Translation function to translate error messages.
 * @param {unknown} error - The Firebase error object.
 * @param {Ref<string>} emailError - The reference to the email error message.
 * @param {Ref<string>} [passwordError] - Optional reference to the password error message.
 *
 * @returns {boolean} - Whether an error was handled or not.
 */
export function processFirebaseError(
  t: (key: string) => string,
  error: unknown,
  emailError: Ref<string>,
  passwordError?: Ref<string>
): boolean {
  // Cast to firebase error
  const firebaseError = error as TFirebaseError;

  // Email is invalid
  if (firebaseError.code === EFirebaseErrorCode.authInvalidEmail) {
    emailError.value = t('auth.error.invalidEmail');
    return true;
  }
  // Email is already in use
  if (firebaseError.code === EFirebaseErrorCode.authEmailAlreadyInUse) {
    emailError.value = t('auth.error.emailAlreadyInUse');
    return true;
  }
  // Account is locked
  if (firebaseError.code === EFirebaseErrorCode.authAccountLocked) {
    emailError.value = t('auth.error.accountLocked');
    return true;
  }

  // Check password errors if necessary
  if (passwordError) {
    // Password is too weak
    if (firebaseError.code === EFirebaseErrorCode.authWeekPassword) {
      passwordError.value = t('auth.error.passwordTooWeak');
      return true;
    }
    // Invalid credentials
    if (firebaseError.code === EFirebaseErrorCode.authInvalidCredentials) {
      passwordError.value = t('auth.error.invalidCredentials');
      return true;
    }
    // Too many failed requests
    if (firebaseError.code === EFirebaseErrorCode.authTooManyRequests) {
      passwordError.value = t('auth.error.tooManyRequests');
      return true;
    }
  }

  // Unknown error
  return false;
}
