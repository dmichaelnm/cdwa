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
    // Applications
    application: {
      // Amazon S3 Bucket
      s3: 'Amazon AWS S3 Bucket',
      // Snowflake Database
      snowflake: 'Snowflake Datenbank'
    },
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
    },
    // Diagram types
    diagram: {
      // Architecture
      architecture: 'Architektur-Modell'
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
    // Search
    search: 'Suchen',
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
      message: 'Sind Sie sicher, dass Sie {article} {type} "{name}" löschen wollen? Dieser Vorgang kann nicht rückgängig gemacht werden.'
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
    // Article of the document type
    article: 'das',
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
  },

  // Diagram Messages
  diagram: {
    // Name of the type
    type: 'Diagramm',
    // Article of the type
    article: 'das',
    // Plural
    plural: 'Diagramme',
    // Labels
    label: {
      // Diagram Name
      name: 'Name des Diagramms',
      // Diagram Type
      type: 'Typ des Diagramms'
    },
    // Button Messages
    button: {
      // Create Diagram
      create: 'Neues Diagramm'
    },
    // Diagram Overview Messages
    overview: {
      // Title
      title: 'Übersicht - Diagramme',
      // Message
      message: 'Hier sehen Sie eine Übersicht über alle bisher in diesem Projekt erstellten Diagramme. Ein Diagramm ' +
        'bietet eine bestimmte Sicht oder einen Ausschnitt auf Ihr Modell. Es gibt verschiedene Typen von Diagrammen ' +
        'die verschiedene Aspekte Ihres Modell abbilden.',
      // Empty Table Message
      empty: 'Für dieses Projekt existiert noch kein Diagramm. Um mit der Modellierung beginnen zu können, müssen ' +
        'Sie mindestens ein Diagramm anlegen.'
    },
    // Diagram Editor Messages
    editor: {
      // Create Messages
      create: {
        // Title
        title: 'Neues Diagramm erstellen',
        // Message
        message: 'Erstellen Sie hier ein neues Diagramm, um eine neue Sicht oder einen Ausschnitt Ihres Modells ' +
          'darzustellen. Je nach dem, welchen Diagrammtyp Sie wählen, können Sie unterschiedliche Aspekte Ihres Modells darstellen.'
      },
      // Edit Messages
      edit: {
        // Title
        title: 'Diagramm bearbeiten',
        // Message
        message: 'Hier können Sie die Eigenschaften des Diagramms bearbeiten. Sie können jedoch nicht mehr den Typ ' +
          'des Diagramms ändern. Hierzu müssten Sie ein neues Diagramm anlegen und dieses danach löschen. Dabei ' +
          'geht jedoch der Inhalt des Diagramms verloren.'
      },
      // View Messages
      view: {
        // Title
        title: 'Diagramm betrachten',
        // Message
        message: 'Hier können Sie die Eigenschaften des Diagramms einsehen. Aufgrund fehlender Berechtigungen können ' +
          'Sie jedoch keine Änderungen vornehmen.'
      }
    }
  },

  // Connection Messages
  connection: {
    // Name of the document type
    type: 'Verbindung',
    // Article of the document type
    article: 'die',
    // Plural
    plural: 'Verbindungen',
    // Connection Labels
    label: {
      // Access Key ID
      accessKeyId: 'ID des Zugriffs-Schlüssels',
      // Account
      account: 'Konto',
      // Application
      application: 'Applikation',
      // Bucket Name
      bucket: 'Name des Buckets',
      // Database
      database: 'Datenbank',
      // Connection Name
      name: 'Name der Verbindung',
      // Password
      password: 'Kennwort',
      // Connection Properties
      properties: 'Verbindungseigenschaften',
      // Region
      region: 'Region',
      // Role
      role: 'Rolle',
      // Secret Access Key
      secretAccessKey: 'Geheimer Zugriffs-Schlüssel',
      // User Name
      username: 'Benutzername',
      // Warehouse
      warehouse: 'Warehouse'
    },
    // Button Labels
    button: {
      // Create Connection Button
      create: 'Neue Verbindung',
      // Test Connection Button
      test: 'Verbindung testen'
    },
    // Application Connection Properties Messages
    application: {
      // AWS S3 Bucket
      s3: 'Geben Sie hier die notwendigen Informationen für den Zugriff auf das AWS S3 Bucket an. Aus ' +
        'Sicherheitsgründen wird empfohlen, einen eigenen Benutzer für den Zugriff anzulegen, der nur die absolut ' +
        'notwendigen Berechtigungen besitzt. Dies können Sie im Bereich IAM Ihrer AWS-Konsole machen. Dort können ' +
        'dann auch die notwendigen Schlüssel-Informationen für den Benutzer generiert werden.',
      // Snowflake Database
      snowflake: 'Geben Sie hier die notwendigen Informationen für den Zugriff auf die Snowflake Datenbank an. Aus ' +
        'Sicherheitsgründen wird empfohlen, einen eigenen Benutzer nur mit den absolut notwendigen Zugriffsrechten ' +
        'anzulegen. Dies können Sie im Admin-Bereich unter "User & Roles" der Snowflake-Web-UI machen.'
    },
    // Connection Overview Page
    overview: {
      // Title
      title: 'Übersicht - Verbindungen',
      // Message
      message: 'Diese Übersicht zeigt alle in diesem Projekt angelegten Verbindungen zu externen Applikationen. ' +
        'Je nach dem, welche Berechtigungen Sie haben, können Sie diese hier bearbeiten oder auch löschen.',
      // Empty Table Message
      empty: 'Für dieses Projekt wurden bisher noch keine Verbindungen zu externen Applikationen wie zum Beispiel ' +
        'einer Cloud-Datenbank hergestellt. Solche Verbindungen können genutzt werden, um Modell-Artefakte per ' +
        'Reverse Engineering leicht erstellen zu können sowie diese später auch auf dem Ziel-System bereitstellen zu ' +
        'können.'
    },
    // Connection Editor Page
    editor: {
      // Create Connection
      create: {
        // Title
        title: 'Neue Verbindung erstellen',
        // Message
        message: 'Hier können Sie eine neue Verbindung zu einer externen Applikation erstellen. Wählen Sie dazu aus, ' +
          'um welche Applikation es sich handelt und geben Sie dann die notwendigen Eigenschaften für den Aufbau ' +
          'einer Verbindung zu dieser Applikation an. Beachten Sie, dass Sie die Art der Applikation später nicht ' +
          'mehr ändern können.'
      },
      // Edit Connection
      edit: {
        // Title
        title: 'Verbindung bearbeiten',
        // Message
        message: 'Hier können Sie die gewählte Verbindung bearbeiten und zum Beispiel die Anmeldeinformation ' +
          'aktualisieren. Beachten Sie, dass Sie die Applikation nicht mehr ändern können. Für diesen Fall müssen Sie ' +
          'eine neue Verbindung erstellen und diese löschen.'
      },
      // View connection
      view: {
        // Title
        title: 'Verbindung betrachten',
        // Message
        message: 'Hier können Sie die Eigenschaften der Verbindung betrachten. Eine Möglichkeit der Änderung besteht ' +
          'aufgrund fehlender Berechtigungen jedoch nicht.'
      }
    },
    // Dialog Messages
    dialog: {
      // Success Dialog
      success: {
        // Title
        title: 'Verbindung erfolgreich',
        // Message
        message: 'Die Verbindung zur externen Anwendung konnte erfolgreich hergestellt werden.'
      },
      // Error Dialog
      error: {
        // Title
        title: 'Verbindung fehlgeschlagen',
        // Message
        message: 'Die Verbindung zur externen Anwendung konnte leider nicht hergestellt werden.'
      }
    }
  }
};
