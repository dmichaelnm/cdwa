import * as tp from '../util/types';
import * as fs from 'firebase/firestore';
import * as au from 'firebase/auth';
import { firebaseAuth } from 'src/scripts/util/firebase';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';

/**
 * This interface represents the account data.
 */
interface IAccountData {
  // Profile data
  profile: {
    // First name of the account user
    firstName: string;
    // Last name of the account user
    lastName: string;
    // Email address of the account user
    email: string;
  };
  // Preferences of the account user
  preferences: {
    // The preferred UI mode
    uiMode: tp.EUIMode;
    // The preferred UI Language
    uiLanguage: tp.EUILanguage;
  };
  // State of the account
  state: {
    // Lock status
    locked: boolean;
    // Active project
    activeProject: string | null;
    // Last login
    lastLogin: fs.Timestamp | null;
  };
}

/**
 * Represents an account in Firebase.
 *
 * @extends FirestoreDocument<IAccountData>
 * @implements INamed
 */
export class Account extends FirestoreDocument<IAccountData> implements tp.INamed {

  /**
   * Registers a callback function to be called whenever the account state changes.
   *
   * @param {function} callback - The callback function to be called with the updated account state.
   *                             The function should accept a single parameter which is an Account object
   *                             or null if there is no authenticated user.
   *
   * @return {void}
   */
  static onAccountStateChange(
    callback: (account: Account | null) => void
  ): void {
    // Register the Firebase event listener for changes of the authenticated user.
    au.onAuthStateChanged(firebaseAuth, async (user) => {
      // If the user is null, there is no authenticated user
      if (user === null) {
        callback(null);
      }
      // There is an authenticated user
      else {
        // Load the account object
        const account = await Account.loadAccount(user.uid);
        // Check, if account is locked
        callback(!account.data.state.locked ? account : null);
      }
    });
  }

  /**
   * Reset the password for the given email.
   *
   * @param {string} email - The email address of the user.
   *
   * @returns {Promise<void>} - A Promise that resolves if the password reset email is successfully sent.
   */
  static async resetPassword(email: string): Promise<void> {
    // Request password reset email
    await au.sendPasswordResetEmail(firebaseAuth, email);
  }

  /**
   * Create an account with the given details.
   *
   * @param {string} firstName - The first name of the user.
   * @param {string} lastName - The last name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {tp.EUIMode} uiMode - The UI mode preference of the user.
   * @param {tp.EUILanguage} uiLanguage - The UI language preference of the user.
   *
   * @return {Promise<Account>} The created account object.
   */
  static async createAccount(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    uiMode: tp.EUIMode,
    uiLanguage: tp.EUILanguage
  ): Promise<Account> {
    // Register the account on Firebase
    const credentials = await au.createUserWithEmailAndPassword(firebaseAuth, email, password);
    // Update the display name
    await au.updateProfile(credentials.user, { displayName: firstName + ' ' + lastName });
    // Create account data
    const data: IAccountData = {
      profile: { firstName: firstName, lastName: lastName, email: email },
      preferences: { uiMode: uiMode, uiLanguage: uiLanguage },
      state: { locked: true, activeProject: null, lastLogin: null }
    };
    // Create and return the firestore document
    return FirestoreDocument.create<IAccountData, Account>(
      tp.EDocumentType.account,
      data,
      (config) => new Account(config),
      undefined,
      credentials.user.uid
    );
  }

  /**
   * Loads an Account document from Firestore based on the provided id.
   *
   * @param {string} id - The id of the Account document to load.
   *
   * @returns {Promise<Account>} - A Promise that resolves to the loaded Account.
   */
  static async loadAccount(id: string): Promise<Account> {
    return FirestoreDocument.load<IAccountData, Account>(
      tp.EDocumentType.account,
      id,
      (config) => new Account(config)
    );
  }

  /**
   * Returns the full name of the account owner.
   *
   * @returns {string} The full name of the profile.
   */
  getName(): string {
    return this.data.profile.firstName + ' ' + this.data.profile.lastName;
  }
}
