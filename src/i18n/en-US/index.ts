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

  // Enumeration Labels
  enum: {
    // Applications
    application: {
      // Amazon S3 Bucket
      s3: 'Amazon AWS S3 Bucket',
      // Snowflake Database
      snowflake: 'Snowflake Database'
    },
    // Attribute Types
    type: {
      // String
      string: 'String',
      // Number
      number: 'Number',
      // Boolean
      boolean: 'Boolean'
    },
    // Project Member Roles
    role: {
      // Owner
      owner: 'Owner',
      // Manager
      manager: 'Manager',
      // Maintainer
      maintainer: 'Maintainer',
      // Deployer
      deployer: 'Deployer',
      // Developer
      developer: 'Developer',
      // Visitor
      visitor: 'Visitor'
    }
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
    // Custom Attributes
    customAttributes: 'Custom Attributes',
    // Description
    description: 'Description (optional)',
    // Details
    details: 'Details',
    // Key
    key: 'Key',
    // Rows per Page
    rowsPerPage: 'Rows per page',
    // Type
    type: 'Type',
    // Value
    value: 'Value'
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

  // General Messages
  message: {
    // Custom Attributes Table
    customAttributes: {
      // Message
      message: 'Here you can define your own attributes, which can later be referenced in templates. An attribute must ' +
        'have a unique key and be either a character string, a number or a boolean value. Any number of attributes can ' +
        'be defined.',
      // Empty Table Message
      messageEmpty: 'No custom attributes have been created yet.'
    }
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
    },
    // Delete Document Dialog
    delete: {
      // Title
      title: 'Delete {type}?',
      // Message
      message: 'Are you sure you want to delete {article} {type} "{name}"? This action can not be undone.'
    },
    // Discard Changes Dialog
    discard: {
      // Title
      title: 'Discard Changes?',
      // Message
      message: 'Are you sure you want to exit the editor? All changes made so far will be lost.'
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
  },

  // Project Messages
  project: {
    // Name of the document type
    type: 'Project',
    // Article of the document type
    article: 'the',
    // Project Labels
    label: {
      // Project Name
      name: 'Project Name',
      // Project Owner
      owner: 'Owner',
      // Project Manager
      manager: 'Project Manager',
      // Project Member
      memberName: 'Project Member Name',
      // Project Members
      members: 'Project Members',
      // Own Role
      ownRole: 'Own Role',
      // Roles
      role: 'Role'
    },
    // Project Button Labels
    button: {
      // Create New Project
      create: 'New Project'
    },
    // Project Overview Messages
    overview: {
      // Empty Project Overview Message
      empty: 'It appears that you have not created your own project yet and have not been added as a member ' +
        'to any other projects. Just start with your own project.',
      // Title
      title: 'Overview - Projects',
      // Message
      message: 'In this overview you can see all projects that you have created yourself or in which you have been ' +
        'added as a member. Depending on your role in these projects, you can also edit or delete them here.'
    },
    // Project Editor Messages
    editor: {
      // Create Project Messages
      create: {
        // Title
        title: 'Create New Project',
        // Message
        message: 'Create a new project here. As the owner, you have full control over the project.In addition to the ' +
          'name and an optional description, you can also specify a project manager. This person has the same rights ' +
          'as you, with the exception that he is not allowed to delete the project and is not allowed to appoint ' +
          'another project manager.'
      },
      // Edit Project Messages
      edit: {
        // Title
        title: 'Edit Project',
        // Message
        message: 'Here you can customize the properties of the project such as name or description and also add or ' +
          'remove members of the project or adjust their roles. If you are the project owner, you can also change the ' +
          'project manager.',
        // Members Table Messages
        members: {
          // Message
          message: 'Here you will see a list of all members of your project. Every member will be able to see this ' +
            'project, regardless of the member\'s role. If you are the owner or project manager, you can add and ' +
            'remove new members here and you can also define the roles of the members here. The roles determine what ' +
            'permissions the members have.',
          // Empty Table Message
          messageEmpty: 'No members have been assigned to this project yet.',
          // Error Messages
          error: {
            // New member is owner
            isOwner: 'The project owner cannot be added as a member.',
            // New member is manager
            isManager: 'The project manager cannot be added as a member.',
            // New member is already added
            isMember: 'This account is already a project member.'
          }
        }
      },
      // View Project Messages
      view: {
        // Title
        title: 'View Project',
        // Message
        message: 'Here you can view the properties of the project. However, there is no possibility of making changes ' +
          'due to a lack of authorization.'
      }
    }
  },

  // Connection Messages
  connection: {
    // Name of the document type
    type: 'Connection',
    // Article of the document type
    article: 'the',
    // Connection Labels
    label: {
      // Access Key ID
      accessKeyId: 'Access Key ID',
      // Account
      account: 'Account',
      // Application
      application: 'Application',
      // Bucket Name
      bucket: 'Bucket Name',
      // Database
      database: 'Database',
      // Connection Name
      name: 'Connection Name',
      // Password
      password: 'Password',
      // Connection Properties
      properties: 'Connection Properties',
      // Region
      region: 'Region',
      // Role
      role: 'Role',
      // Secret Access Key
      secretAccessKey: 'Secret Access Key',
      // User Name
      username: 'Username',
      // Warehouse
      warehouse: 'Warehouse'
    },
    // Button Labels
    button: {
      // Create Connection Button
      create: 'New Connection',
      // Test Connection Button
      test: 'Test Connection'
    },
    // Connection Overview Messages
    overview: {
      // Title
      title: 'Overview - Connections',
      // Message
      message: 'This overview shows all connections to external applications created in this project. Depending on ' +
        'what permissions you have, you can edit or delete them here.',
      // Empty Table Message
      empty: 'For this project, no connections to external applications such as a cloud database have yet been ' +
        'established. Such connections can be used to easily create model artifacts via reverse engineering and to ' +
        'later make them available on the target system.'
    },
    // Connection Editor Page
    editor: {
      // Create Connection
      create: {
        // Title
        title: 'Create New Connection',
        // Message
        message: 'Here you can create a new connection to an external application. To do this, select which ' +
          'application it is and then specify the properties necessary to establish a connection to this application. ' +
          'Please note that you cannot change the type of application later.'
      },
      // Edit Connection
      edit: {
        // Title
        title: 'Edit Connection',
        // Message
        message: 'Here you can edit the selected connection and, for example, update the login information. Please ' +
          'note that you can no longer change the application. In this case you have to create a new connection and ' +
          'delete it.'
      },
      // View connection
      view: {
        // Title
        title: 'View Connection',
        // Message
        message: 'Here you can view the properties of the connection. However, there is no possibility of making ' +
          'changes due to a lack of authorization.'
      }
    }
  }
};
