import * as fd from 'src/scripts/firestore/firestore-document';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { EDocumentType, INamed, TDocumentAttribute } from 'src/scripts/util/types';
import { Project } from 'src/scripts/firestore/project';
import { copyAttributes } from 'src/scripts/util/utilities';
import { useCloudFunctions } from 'src/scripts/util/composables';
import { Assert } from 'src/scripts/util/assert';
import { getAuthorizedUserName } from 'src/scripts/util/firebase';
import { Timestamp } from 'firebase/firestore';

/**
 * An enumeration representing the possible connection applications.
 */
export enum EConnectionApplication {
  // AWS S3 Bucket
  s3 = 's3',
  // Snowflake Database
  snowflake = 'snowflake'
}

/**
 * Represents the connection properties for an Amazon S3 bucket.
 */
export type TConnectionPropertiesS3 = {
  // The name of the bucket
  bucket: string;
  // The code of the region
  region: string;
  // The access key ID
  accessKeyId: string;
  // The secret access key
  secretAccessKey: string;
}

/**
 * Represents the connection properties for Snowflake database.
 */
export type TConnectionPropertiesSnowflake = {
  // Name of the account
  account: string;
  // Name of the user for login
  username: string;
  // Password of the user
  password: string;
  // Optional database name
  database: string | null;
  // Optional warehouse name
  warehouse: string | null;
  // Optional role name
  role: string | null;
}

/**
 * Represents the connection properties for a specific type of connection.
 */
export type TConnectionProperties = TConnectionPropertiesS3 | TConnectionPropertiesSnowflake;

/**
 * Represents the connection data object.
 *
 * @extends fd.IDocumentCommonData
 * @extends fd.IDocumentAttributeData
 * @extends fd.IDocumentMetaData
 */
export interface IConnectionData extends fd.IDocumentCommonData, fd.IDocumentAttributeData, fd.IDocumentMetaData {
  // External Application
  application: EConnectionApplication;
  // Connection Properties
  properties: TConnectionProperties;
}

/**
 * Represents a connection.
 *
 * @extends ProjectDocument
 * @implements INamed
 *
 * @template IConnectionData - The type of connection data.
 */
export class Connection extends ProjectDocument<IConnectionData> implements INamed {

  /**
   * Retrieves the name of the connection.
   *
   * @return {string} The name of the connection.
   */
  getName(): string {
    return this.data.common.name;
  }

  /**
   * Creates a new connection document.
   *
   * @param {Project} project - The project to create the connection in.
   * @param {string} name - The name of the connection.
   * @param {string | null} description - The description of the connection.
   * @param {EConnectionApplication} application - The application of the connection.
   * @param {TConnectionProperties} properties - The properties of the connection.
   * @param {TDocumentAttribute[]} attributes - The attributes of the connection.
   *
   * @returns {Promise<Connection>} A promise that resolves to the created connection document.
   */
  static async createConnection(
    project: Project,
    name: string,
    description: string | null,
    application: EConnectionApplication,
    properties: TConnectionProperties,
    attributes: TDocumentAttribute[]
  ): Promise<Connection> {
    // Create the data structure
    const data: IConnectionData = {
      common: { name: name, description: description },
      application: application,
      properties: properties,
      attributes: attributes
    };
    // Create the connection document
    const connection = await ProjectDocument.createProjectDocument<IConnectionData, Connection>(
      project,
      EDocumentType.connection,
      data,
      (config: fd.TFirestoreDocumentConfig<IConnectionData>) => new Connection(
        {
          id: config.documentRef ? config.documentRef.id : config.id,
          path: config.documentRef ? fd.FirestoreDocument.extractParentPath(config.documentRef.path) : config.path,
          data: data
        },
        project
      ),
      Connection.encrypt
    );
    // Add metadata to connection
    connection.data.meta = {
      created: { by: getAuthorizedUserName(), at: Timestamp.now() }
    };
    // Return the connection
    return connection;
  }

  /**
   * Updates the connection with new data.
   *
   * @param {Connection} connection - The connection to update.
   *
   * @return {Promise<void>} - A Promise that resolves when the connection has been updated successfully.
   */
  static async updateConnection(connection: Connection): Promise<void> {
    // Create a deep copy
    const copy = Connection.deepCopy(connection.data);
    // Update the document with copied data
    await ProjectDocument.updateDocument(
      connection,
      Connection.encrypt,
      copy
    );
  }

  /**
   * Loads connections for a given project.
   *
   * @param {Project} project - The project for which to load the connections.
   *
   * @return {Promise<void>} - A Promise that resolves when the connections have been loaded and set on the project.
   */
  static async loadConnections(project: Project): Promise<void> {
    // Load the connections
    const connections = await fd.FirestoreDocument.query<IConnectionData, Connection>(
      project.getFullPath() + EDocumentType.connection,
      (config) => new Connection(config, project),
      project,
      Connection.decrypt
    );
    // Set the connection on the project
    project.setDocuments(EDocumentType.connection, connections);
  }

  /**
   * Creates a deep copy of the given connection data object.
   *
   * @param {IConnectionData} data - The connection data to be copied.
   *
   * @returns {IConnectionData} - The deep copy of the connection data.
   */
  private static deepCopy(data: IConnectionData): IConnectionData {
    // Create a deep copy of the data structure
    const copy: IConnectionData = {
      common: { name: data.common.name, description: data.common.description },
      application: data.application,
      properties: { ...data.properties },
      attributes: copyAttributes(data.attributes)
    };
    // Check if meta attribute exists
    if (data.meta) {
      copy.meta = {
        created: { by: data.meta.created.by, at: data.meta.created.at }
      };
      // Check if altered attribute exists
      if (data.meta.altered) {
        copy.meta.altered = {
          by: data.meta.altered.by, at: data.meta.altered.at
        };
      }
    }
    // Return the copy
    return copy;
  }

  /**
   * Encrypts the secrets of the connection properties.
   *
   * @param {IConnectionData} data - The connection data to be encrypted.
   * @param {Project} project - The project object.
   *
   * @return {Promise<IConnectionData>} - The encrypted connection data.
   */
  private static async encrypt(data: IConnectionData, project: Project): Promise<IConnectionData> {
    // Make a deep copy
    const copy = Connection.deepCopy(data);
    // Get encrypt method
    const { cfEncrypt } = useCloudFunctions();
    // Encrypt all AWS S3 secrets
    if (data.application === EConnectionApplication.s3) {
      // Send the request
      const encrypted = await cfEncrypt(
        project.getOwner().accountId,
        [
          (data.properties as TConnectionPropertiesS3).accessKeyId,
          (data.properties as TConnectionPropertiesS3).secretAccessKey
        ]
      );
      // Apply encrypted values
      (copy.properties as TConnectionPropertiesS3).accessKeyId = encrypted[0];
      (copy.properties as TConnectionPropertiesS3).secretAccessKey = encrypted[1];
    }
    // Encrypt Snowflake secrets
    else if (data.application === EConnectionApplication.snowflake) {
      // Send the request
      const encrypted = await cfEncrypt(
        project.getOwner().accountId,
        [(data.properties as TConnectionPropertiesSnowflake).password]
      );
      // Apply encrypted values
      (copy.properties as TConnectionPropertiesSnowflake).password = encrypted[0];
    }
    // Return the copy
    return copy;
  }

  /**
   * Decrypts the secrets of the connection properties.
   *
   * @param {IConnectionData} data - The data to decrypt.
   * @param {Project} [project] - The project associated with the data.
   *
   * @returns {Promise<void>} - A promise that resolves when the data is decrypted.
   */
  private static async decrypt(data: IConnectionData, project?: Project): Promise<void> {
    // Assert project
    Assert.assertValueIsSet(project, 'project');
    // Get encrypt method
    const { cfDecrypt } = useCloudFunctions();
    // Decrypt all AWS S3 secrets
    if (data.application === EConnectionApplication.s3) {
      // Send the request
      const decrypted = await cfDecrypt(
        (project as Project).getOwner().accountId,
        [
          (data.properties as TConnectionPropertiesS3).accessKeyId,
          (data.properties as TConnectionPropertiesS3).secretAccessKey
        ]
      );
      // Apply decrypted values
      (data.properties as TConnectionPropertiesS3).accessKeyId = decrypted[0];
      (data.properties as TConnectionPropertiesS3).secretAccessKey = decrypted[1];
    }
    // Decrypt Snowflake Secrets
    else if (data.application === EConnectionApplication.snowflake) {
      // Send the request
      const decrypted = await cfDecrypt(
        (project as Project).getOwner().accountId,
        [(data.properties as TConnectionPropertiesSnowflake).password]
      );
      // Apply decrypted values
      (data.properties as TConnectionPropertiesSnowflake).password = decrypted[0];
    }
  }
}

