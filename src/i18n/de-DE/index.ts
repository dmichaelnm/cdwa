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

  // General Menu Labels
  menu: {
    // Dark Mode
    darkMode: 'Dunkler Modus',
    // Language
    language: 'Sprache',
    // Light Mode
    lightMode: 'Heller Modus',
    // Logout
    logout: 'Abmelden'
  },

  // General Labels
  label: {
    // Altered By At
    altered: 'Geändert von / am',
    // Created By At
    created: 'Erstellt von / am',
    // Description
    description: 'Beschreibung (optional)',
    // Rows per Page
    rowsPerPage: 'Zeilen pro Seite'
  },

  // General Button Labels
  button: {
    // Back
    back: 'Zurück',
    // Cancel
    cancel: 'Abbrechen',
    // Close
    close: 'Schließen',
    // Okay
    okay: 'Okay',
    // Save
    save: 'Speichern'
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
    },
    // Account Selector Dialog
    accountSelect: {
      // Title
      title: 'Konto auswählen',
      // Message
      message: 'Geben Sie hier die Email-Adresse des Kontos an, welches Sie auswählen möchten. Beachten Sie, dass das ' +
        'Konto dazu bereits registriert sein muss.',
      // Error Messages
      error: {
        // Unknown email address
        emailUnknown: 'Die Email-Adresse ist unbekannt.'
      }
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
      emailAlreadyInUse: 'Die Email-Adresse wird bereits verwendet.',
      // Account is locked
      accountLocked: 'Das Konto ist gesperrt.',
      // Invalid credentials
      invalidCredentials: 'Die Anmeldedaten sind ungültig.',
      // Too many failed requests
      tooManyRequests: 'Zu viele fehlgeschlagene Anmeldeversuche.'
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
  },

  // Project Messages
  project: {
    // Project Labels
    label: {
      // Project Name
      name: 'Name des Projekts',
      // Project Owner
      owner: 'Eigentümer',
      // Project Manager
      manager: 'Projektleiter'
    },
    // Project Button Labels
    button: {
      // Create New Project
      create: 'Neues Projekt'
    },
    // Project Overview Messages
    overview: {
      // Empty Project Overview Message
      empty: 'Wie es scheint, haben Sie bisher noch kein eigenes Projekt erstellt und wurden auch noch nicht ' +
        'anderen Projekten als Mitglied hinzugefügt. Beginnen Sie doch einfach mit Ihrem eigenen Projekt.',
      // Title
      title: 'Übersicht - Projekte',
      // Message
      message: 'In dieser Übersicht sehen Sie alle Projekte, die Sie selbst erstellt haben oder in denen Sie als ' +
        'Mitglied hinzugefügt wurden. Je nachdem, welche Rolle Sie in diesen Projekten haben, können Sie diese hier ' +
        'auch editieren oder löschen.'
    },
    // Project Editor Messages
    editor: {
      // Create Project Messages
      create: {
        // Title
        title: 'Neues Projekt erstellen',
        // Message
        message: 'Erstellen Sie hier ein neues Projekt. Sie selbst haben als Eigentümer die volle Kontrolle über das ' +
          'Projekt. Sie können neben  dem Namen und einer optionalen Beschreibung auch einen Projektleiter festlegen. ' +
          'Dieser hat diesselben Rechte wie Sie mit der Ausnahme, dass er das Projekt nicht löschen darf und keinen ' +
          'anderen Projektleiter einsetzen darf.'
      },
      // Edit Project Messages
      edit: {
        // Title
        title: 'Projekt bearbeiten',
        // Message
        message: 'Hier können Sie die Eigenschaften des Projekts wie Name oder Beschreibung anpassen und auch ' +
          'Mitglieder des Projekts hinzufügen oder entfernen oder deren Rollen anpassen. Wenn Sie der Projekteigentümer ' +
          'sind, können Sie außerdem den Projektleiter ändern.'
      }
    }
  },

  // Role Messages
  role: {
    // Default Messages
    default: {
      // Default Role Name
      name: 'Besucher',
      // Default Role Description
      description: 'Diese Rolle besitzt keinerlei Berechtigungen. Konten, die ausschließlich diese Rolle innehaben, ' +
        'können keinerlei Änderungen am Projekt vornehmen.'
    }
  }
};
