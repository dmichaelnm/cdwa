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

export enum EDocumentType {
  // Account
  account = 'account'
}
