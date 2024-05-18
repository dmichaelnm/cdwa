export default {

  // Application Messages
  application: {
    // Application Title
    title: 'Cloud Data Warehouse Architect',
    // Copyright Notice
    copyright: '&copy; Copyright 2024 Dirk Michael',
    // Version Information
    version: 'Version {major}.{minor}.{patch} ({env}-{build})'
  },

  // Language Option Labels
  language: {
    // English
    enUS: 'English',
    // German
    deDE: 'German'
  },

  // General Menu Labels
  menu: {
    // Dark Mode
    darkMode: 'Dark Mode',
    // Language
    language: 'Language',
    // Light Mode
    lightMode: 'Light Mode',
    // Logout
    logout: 'Log Out'
  },

  // General Labels
  label: {
    // Altered By At
    altered: 'Altered by / at',
    // Created By At
    created: 'Created by / at',
    // Description
    description: 'Description (optional)',
    // Rows per Page
    rowsPerPage: 'Rows per page'
  },

  // General Button Labels
  button: {
    // Back
    back: 'Back',
    // Cancel
    cancel: 'Cancel',
    // Close
    close: 'Close',
    // Okay
    okay: 'Okay',
    // Save
    save: 'Save'
  },

  // General Error Messages
  error: {
    // Empty Input Field
    emptyInputField: 'The input field must not be empty.'
  },

  // General Dialog Messages
  dialog: {
    // Unexpected Error Dialog
    unexpected: {
      // Title
      title: 'Unexpected Error',
      // Message
      message: 'An unexpected error has occurred. This should not have happened and is probably due to an error in ' +
        'the application. You can inform your administrator about this error. Below you will find more details about ' +
        'this error.'
    },
    // Account Selector Dialog
    accountSelect: {
      // Title
      title: 'Choose Account',
      // Message
      message: 'Enter the email address of the account you would like to select here. Please note that the account ' +
        'must already be registered to do this.',
      // Error Messages
      error: {
        // Unknown email address
        emailUnknown: 'The email address is unknown.'
      }
    }
  },

  // Authentication Messages
  auth: {
    // Authentication Labels
    label: {
      // Email Address
      email: 'Email Address',
      // First Name
      firstName: 'First Name',
      // Last Name
      lastName: 'Last Name',
      // Password
      password: 'Password',
      // Repeat Password
      repeatPassword: 'Repeat Password'
    },
    // Authentication Buttons
    button: {
      // Login Button
      login: 'Log In',
      // Register Account Button
      register: 'Register Account',
      // Reset Password Button
      reset: 'Reset Password'
    },
    // Authentication Error Messages
    error: {
      // Password and Repeat Password has not the same value
      passwordsDifferent: 'The both passwords must be equal.',
      // Password is too weak
      passwordTooWeak: 'The password is too weak',
      // Invalid Email Address
      invalidEmail: 'The email address is invalid.',
      // Email already in use
      emailAlreadyInUse: 'The email address is already in use.',
      // Account is locked
      accountLocked: 'The account is locked.',
      // Invalid credentials
      invalidCredentials: 'The credentials are invalid.',
      // Too many failed requests
      tooManyRequests: 'Too many failed login attempts.'
    },
    // Login Page
    login: {
      // Login Page Message
      message: 'To log in you need a registered account. You can easily create this yourself by clicking on the ' +
        '“Register Account” link. Please note that after successful registration, the account still needs to be ' +
        'activated by an administrator.'
    },
    // Register Account Page
    register: {
      // Register Account Page Message
      message: 'You can register a new account here. The email address used for this must not belong to an account ' +
        'that has already been registered. Please note that after successful registration, the account must be ' +
        'activated by an administrator before you can log in.',
      // Register Account Page Dialog Messages
      dialog: {
        // Success dialog title
        title: 'Account registered successfully',
        // Success dialog message
        message: 'Congratulations. Your account has been successfully registered. Please inform an administrator ' +
          'so that they can activate your account. Unfortunately, it is not possible to login beforehand.'
      }
    },
    // Reset Password Page
    reset: {
      // Reset password general message
      message: 'If you have forgotten your password or would like to change it for other reasons, you can have an ' +
        'email sent to you here that contains a link that you can use to assign a new password. To do this, simply ' +
        'enter your account email address in the field below.',
      // Reset Password Page Dialog Messages
      dialog: {
        // Success dialog title
        title: 'Email successfully sent',
        // Success dialog message
        message: 'The password reset email was sent successfully. If necessary, also check your spam folder.'
      }
    }
  }
};
