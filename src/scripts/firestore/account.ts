import * as tp from '../util/types';
import * as fs from 'firebase/firestore';
import * as au from 'firebase/auth';
import { EDocumentType, INamed } from '../util/types';
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
    language: tp.EUILanguage;
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
export class Account extends FirestoreDocument<IAccountData> implements INamed {

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
   * Creates a new account for the given user ID.
   *
   * @param {string} userId - The ID of the user.
   * @param {IAccountData} data - The data for the account.
   *
   * @returns {Promise<Account>} - A promise that resolves with the newly created Account object.
   */
  static async createAccount(userId: string, data: IAccountData): Promise<Account> {
    return FirestoreDocument.create<IAccountData, Account>(
      EDocumentType.account,
      data,
      (config) => new Account(config),
      undefined,
      userId
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
      EDocumentType.account,
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
