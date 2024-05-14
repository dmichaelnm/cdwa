import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from 'src/scripts/config/firebase';
import { Assert } from 'src/scripts/util/assert';

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
  authAccountLocked = 'auth/account-locked'
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
