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

  // Enumeration Labels
  enum: {
    // Attribute Types
    type: {
      // String
      string: 'Zeichenkette',
      // Number
      number: 'Zahlenwert',
      // Boolean
      boolean: 'Wahrheitswert'
    },
    // Project Member Roles
    role: {
      // Owner
      owner: 'Eigentümer',
      // Manager
      manager: 'Projektleiter',
      // Maintainer
      maintainer: 'Betreuer',
      // Deployer
      deployer: 'Bereitsteller',
      // Developer
      developer: 'Entwickler',
      // Visitor
      visitor: 'Besucher'
    }
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
    // Custom Attributes
    customAttributes: 'Benutzerdefinierte Attribute',
    // Description
    description: 'Beschreibung (optional)',
    // Details
    details: 'Details',
    // Key
    key: 'Schlüssel',
    // Rows per Page
    rowsPerPage: 'Zeilen pro Seite',
    // Type
    type: 'Typ',
    // Value
    value: 'Wert'
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

  // General Messages
  message: {
    // Custom Attributes Table
    customAttributes: {
      // Message
      message: 'Hier können eigene Attribute definiert werden, auf die später in Vorlagen referenziert werden kann. ' +
        'Ein Attribut muss dabei einen eindeutigen Schlüssel haben und entweder eine Zeichenkette, eine Zahl oder ein ' +
        'Wahrheitswert sein. Es können beliebig viele Attribute definiert werden.',
      // Empty Table Message
      messageEmpty: 'Bisher wurden noch keine benutzerdefinierten Attribute erstellt.'
    }
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
    },
    // Delete Document Dialog
    delete: {
      // Title
      title: '{type} löschen?',
      // Message
      message: 'Sind Sie sicher, dass Sie {theType} "{name}" löschen wollen? Dieser Vorgang kann nicht rückgängig gemacht werden.'
    },
    // Discard Changes Dialog
    discard: {
      // Title
      title: 'Änderungen verwerfen?',
      // Message
      message: 'Sie sind sicher, dass Sie den Editor verlassen wollen? Alle bisher gemachten Änderungen gehen dadurch ' +
        'verloren.'
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
    // Name of the document type
    type: 'Projekt',
    // Name of the document type with an article
    theType: 'das Projekt',
    // Project Labels
    label: {
      // Project Name
      name: 'Name des Projekts',
      // Project Owner
      owner: 'Eigentümer',
      // Project Manager
      manager: 'Projektleiter',
      // Project Member
      memberName: 'Name des Projekt-Mitglieds',
      // Project Members
      members: 'Projekt-Mitglieder',
      // Own Role
      ownRole: 'Eigene Rolle',
      // Roles
      role: 'Rolle'
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
          'sind, können Sie außerdem den Projektleiter ändern.',
        // Members Table Messages
        members: {
          // Message
          message: 'Hier sehen Sie eine Liste aller Mitglieder Ihres Projekts. Jedes Mitglied wird dieses Projekt ' +
            'sehen können, unabhängig davon, welche Rolle das Mitglied hat. Sofern Sie der Eigentümer oder ' +
            'Projektleiter sind, können Sie hier neue Miglieder hinzufügen und auch entfernen und Sie können hier ' +
            'auch die Rollen der Mitglieder festlegen. Die Rollen bestimmen, welche Berechtigungen die Mitglieder haben.',
          // Empty Table Message
          messageEmpty: 'Bisher wurden diesem Projekt noch keine Mitglieder zugeordnet.',
          // Error Messages
          error: {
            // New member is owner
            isOwner: 'Der Projekteigentümer kann nicht als Mitglied hinzugefügt werden.',
            // New member is manager
            isManager: 'Der Projektleiter kann nicht als Mitglied hinzugefügt werden.',
            // New member is already added
            isMember: 'Dieses Konto ist bereits ein Projekt-Mitglied.'
          }
        }
      },
      // View Project Messages
      view: {
        // Title
        title: 'Projekt betrachten',
        // Message
        message: 'Hier können Sie die Eigenschaften des Projekts einsehen. Eine Möglichkeit zur Änderung besteht ' +
          'jedoch aufgrund fehlender Berechtigungen nicht.'
      }
    }
  }
};
