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
    enUS: 'Englisch',
    // German
    deDE: 'Deutsch'
  },

  // General Button Labels
  button: {
    // Back
    back: 'Zurück',
    // Close
    close: 'Schließen'
  },

  // General Error Messages
  error: {
    // Empty Input Field
    emptyInputField: 'Das Eingabefeld darf nicht leer sein.'
  },

  // General Dialog Messages
  dialog: {
    // Unexpected Error Dialog
    unexpected: {
      // Title
      title: 'Unerwarteter Fehler',
      // Message
      message: 'Es ist ein unerwarteter Fehler aufgetreten. Dies hätte nicht passieren dürfen und beruht vermutlich ' +
        'auf einen Fehler in der Anwendung. Sie können Ihren Administrator über diesen Fehler informieren. Im ' +
        'Folgenden finden Sie mehr Details zu diesem Fehler.'
    }
  },

  // Authentication Messages
  auth: {
    // Authentication Labels
    label: {
      // Email Address
      email: 'Email-Adresse',
      // First Name
      firstName: 'Vorname',
      // Last Name
      lastName: 'Nachname',
      // Password
      password: 'Kennwort',
      // Repeat Password
      repeatPassword: 'Kennwort wiederholen'
    },
    // Authentication Buttons
    button: {
      // Login Button
      login: 'Anmelden',
      // Register Account Button
      register: 'Konto registrieren',
      // Reset Password Button
      reset: 'Kennwort zurücksetzen'
    },
    // Authentication Error Messages
    error: {
      // Password and Repeat Password has not the same value
      passwordsDifferent: 'Die beiden Kennwörter müssen gleich sein.',
      // Password is too weak
      passwordTooWeak: 'Das Kennwort ist zu schwach.',
      // Invalid Email Address
      invalidEmail: 'Die Email-Adresse ist ungültig.',
      // Email already in use
      emailAlreadyInUse: 'Die Email-Adresse wird bereits verwendet.'
    },
    // Login Page
    login: {
      // Login Page Message
      message: 'Für die Anmeldung benötigen Sie ein registriertes Konto. Dieses können Sie sich einfach selbst ' +
        'erstellen, indem Sie auf den Link "Konto registrieren" klicken. Beachten Sie, dass nach erfolgreicher ' +
        'Registrierung das Konto noch von einem Administrator freigeschaltet werden muss.'
    },
    // Register Account Page
    register: {
      // Register Account Page Message
      message: 'Hier können Sie ein neues Konto registrieren. Die dazu verwendete Email-Adresse darf keinem bereits ' +
        'registrierten Konto gehören. Beachten Sie, dass nach erfolgreicher Registrierung das Konto noch von einem ' +
        'Administrator freigeschaltet werden muss, bevor Sie sich anmelden können.',
      // Register Account Page Dialog Messages
      dialog: {
        // Success dialog title
        title: 'Konto erfolgreich registriert',
        // Success dialog message
        message: 'Herzlichen Glückwunsch. Ihr Konto wurde erfolgreich registriert. Bitte informieren Sie einen ' +
          'Administrator, so dass dieser Ihr Konto freischalten kann. Vorher ist eine Anmeldung leider nicht möglich.'
      }
    },
    // Reset Password Page
    reset: {
      // Reset password general message
      message: 'Wenn Sie Ihr Kennwort vergessen haben oder es aus anderen Gründen ändern möchten, können Sie sich hier ' +
        'eine Email zusenden lassen, die einen Link enthält, über den Sie ein neues Kennwort vergeben können. Tragen ' +
        'Sie dazu einfach die Email-Adresse Ihres Kontos in das untenstehende Feld.',
      // Reset Password Page Dialog Messages
      dialog: {
        // Success dialog title
        title: 'Email erfolgreich versendet',
        // Success dialog message
        message: 'Die Email für das Zurücksetzen den Kennworts wurde erfolgreich versendet. Prüfen Sie ' +
          'gegebenenfalls auch Ihren Spam-Ordner.'
      }
    }
  }
};
