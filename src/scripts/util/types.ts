export type TMessageDialogOptions = {
  // Title
  title: string;
  // Message
  message: string;
  // Details
  details: string | null;
  // Marker Color
  color: string | null;
  // Dialog Buttons
  buttons: string[];
  // Callback handler when dialog is about to be closed
  callback: ((value?: string) => boolean | void) | null;
  // Visibility
  visible: boolean;
};

/**
 * This interface represents an object that has an identifier.
 */
export interface IIdentifiable {

  /**
   * Identifier.
   */
  id: string;
}

/**
 * Represents an object that has a name.
 */
export interface INamed {

  /**
   * This interface represents an object that has a displayable name.
   *
   * @returns {string} The name of the object.
   */
  getName(): string;
}

/**
 * Enumeration containing all global events in the application.
 */
export enum EGlobalEvent {
  // UI Language has changed
  languageChanged = 'languageChanged'
}

/**
 * Enumeration containing the possible UI modes.
 */
export enum EUIMode {
  // Light Mode
  light = 'light',
  // Dark Mode
  dark = 'dark'
}

/**
 * Enumeration containing possible UI languages.
 */
export enum EUILanguage {
  // English
  enUS = 'en-US',
  // German
  deDE = 'de-DE'
}

/**
 * Containing the types of all Firestore documents.
 */
export enum EDocumentType {
  // Account
  account = 'account'
}
