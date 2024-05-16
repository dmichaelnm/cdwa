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

  // General Button Labels
  button: {
    // Back
    back: 'Back',
    // Close
    close: 'Close'
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
      emailAlreadyInUse: 'The email address is already in use.'
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
    }
  }
};
