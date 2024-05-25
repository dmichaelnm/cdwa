import { QTableColumn } from 'quasar';
import { TSelectionOption } from 'src/scripts/config/options';

/**
 * Defines the type of the global configuration instance for the application.
 */
export type TGlobalConfig = {
  // Application wide log level
  logLevel: ELogLevel
  // Cloud Functions URL
  cloudFunctionsURL: string;
};

/**
 * Defines the type of the options for the message dialog.
 */
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
  callback: ((value?: string) => boolean | void | Promise<boolean> | Promise<void>) | null;
  // Visibility
  visible: boolean;
};

/**
 * Represents a custom attribute with key, type, and value.
 */
export type TDocumentAttribute = {
  // The key of the attribute
  key: string;
  // The datatype of the attribute
  type: EDocumentAttributeType;
  // The value of the attribute type
  value: string | number | boolean;
}

/**
 * Represents the type of input for a column in an editable table.
 */
export type TEditableTableColumnInput = 'none' | 'string' | 'checkbox' | 'select';

/**
 * Represents a column in an editable table.
 */
export type TEditableTableColumn = QTableColumn &
  {
    // The type of the inline editor.
    input?: TEditableTableColumnInput | { (row: any): TEditableTableColumnInput },
    // The options used for a selection inline editor.
    options?: TSelectionOption<any>[],
    // Flag controlling whether the labels of the options should be translated
    translate?: boolean
    // Flag controlling whether the icons in a selection are shown
    showIcons?: boolean
  }

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
  languageChanged = 'languageChanged',
  // Projects array in session store has changed
  projectsChanged = 'projectsChanged'
}

/**
 * Represents an enum of cookie names.
 */
export enum ECookie {
  // The cookie name for the UI mode
  uiMode = 'ui-mode',
  // The cookie name for the UI Language
  uiLanguage = 'language',
  // The cookie name for the email address of the last logged in account
  email = 'email'
}

/**
 * Represents the available modes for working with a document.
 */
export enum EEditorMode {
  // Create new document
  create = 'create',
  // Edit a document
  edit = 'edit',
  // Delete a document
  delete = 'delete',
  // View a document
  view = 'view'
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
  account = 'account',
  // Project
  project = 'project',
  // Diagrams
  diagram = 'diagram',
  // Connection
  connection = 'connection'
}

/**
 * Enumeration representing the different levels of log messages.
 */
export enum ELogLevel {
  // Trace message
  trace = 0,
  // Debug message
  debug = 1,
  // Information message
  info = 2,
  // Warning message
  warn = 3,
  // Error message
  error = 4
}

/**
 * Enumeration of custom attribute types.
 */
export enum EDocumentAttributeType {
  // String
  string = 'string',
  // Number
  number = 'number',
  // Boolean
  boolean = 'boolean'
}

/**
 * Enumeration representing different roles for project members.
 */
export enum EProjectMemberRole {
  // Owner
  owner = 'owner',
  // Manager
  manager = 'manager',
  // Maintainer
  maintainer = 'maintainer',
  // Deployer
  deployer = 'deployer',
  // Developer
  developer = 'developer',
  // Visitor
  visitor = 'visitor'
}
