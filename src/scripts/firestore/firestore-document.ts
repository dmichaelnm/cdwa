import * as tp from '../util/types';
import * as fs from 'firebase/firestore';
import { Assert } from 'src/scripts/util/assert';
import { firestore, getAuthorizedUserName } from 'src/scripts/util/firebase';
import { Logging } from 'src/scripts/util/logging';
import { Project } from 'src/scripts/firestore/project';

/**
 * The type of configuration for a Firestore document.
 *
 * @template D - The type of the data in the Firestore document.
 */
export type TFirestoreDocumentConfig<D extends object> = {
  // The identifier of the firestore document
  id?: string;
  // The path to the firestore document without the identifier
  path?: string;
  // The data of the firestore document
  data?: D;
  // A firestore document reference
  documentRef?: fs.DocumentReference;
  // A firestore document
  document?: fs.DocumentSnapshot;
}

/**
 * Represents the metadata of a firestore document.
 */
export interface IDocumentMetaData {
  // Metadata structure
  meta?: {
    // Created attributes
    created: {
      // Name of the user who created the document
      by: string;
      // Timestamp of the creation of the document
      at: fs.Timestamp;
    },
    altered?: {
      // Name of the user who altered the document
      by: string;
      // Timestamp of the alteration of the document
      at: fs.Timestamp;
    }
  };
}

/**
 * Represents the type of metadata for a document.
 */
export type TDocumentMetaData = IDocumentMetaData;

/**
 * Represents the common data structure for a document.
 */
export interface IDocumentCommonData {
  // Common data structure
  common: {
    // Name of the document
    name: string;
    // Optional description of the document
    description: string | null;
  };
}

/**
 * Describes the data structure for document attribute data.
 */
export interface IDocumentAttributeData {
  // Custom attributes of the document
  attributes: tp.TDocumentAttribute[];
}

/**
 * Represents a Firestore document.
 *
 * @template D - The type of data contained in the document.
 */
export class FirestoreDocument<D extends object> implements tp.IIdentifiable {

  /**
   * The type of the document.
   */
  type: tp.EDocumentType;

  /**
   * The identifier of the firestore document.
   */
  id: string;

  /**
   * The path to the firestore document without the identifier.
   */
  path: string;

  /**
   * The data contained by the firestore document.
   */
  data: D;

  /**
   * Creates a new instance of a firestore document.
   *
   * @param {TFirestoreDocumentConfig<D>} config - The configuration object for the document.
   */
  constructor(config: TFirestoreDocumentConfig<D>) {
    if (config.id !== undefined) {
      // Initialize with ID, check path and data object
      Assert.assertValueIsSet(config.path, 'path');
      Assert.assertValueIsSet(config.data, 'data');
      // Apply the values
      this.id = config.id;
      this.path = config.path as string;
      this.data = config.data as D;
      this.type = FirestoreDocument.extractDocumentType(config.path as string);
    } else if (config.documentRef !== undefined) {
      // Initialize with document reference, check data object
      Assert.assertValueIsSet(config.data, 'data');
      // Apply the values
      this.id = config.documentRef.id;
      this.path = FirestoreDocument.extractParentPath(config.documentRef.path as string);
      this.data = config.data as D;
      this.type = FirestoreDocument.extractDocumentType(this.path);
    } else {
      // Initialize with firestore document
      Assert.assertValueIsSet(config.document, 'document');
      // Apply the values
      this.id = config.document?.id as string;
      this.path = FirestoreDocument.extractParentPath(config.document?.ref.path as string);
      this.data = config.document?.data() as D;
      this.type = FirestoreDocument.extractDocumentType(this.path);
    }
  }

  /**
   * Retrieves the full path of the document.
   *
   * @return {string} The full path of the document.
   */
  getFullPath(): string {
    return `${this.path}/${this.id}/`;
  }

  /**
   * Creates a new Firestore document at the specified path with the provided data.
   *
   * @param {string} path - The path of the Firestore collection where the document will be created.
   * @param {D} data - The data to be saved in the document.
   * @param {function} creator - A function for creating a new instance of a firestore document.
   * @param {string} [id] - An optional ID to be assigned to the document. If not provided, Firestore will generate a new ID.
   *
   * @returns {Promise<R>} - A Promise that resolves with the created FirestoreDocument instance.
   *
   * @template D The type of the document data.
   * @template R The type of the document instance.
   */
  static async createDocument<D extends object, R extends FirestoreDocument<D>>(
    path: string,
    data: D,
    creator: (config: TFirestoreDocumentConfig<D>) => R,
    id?: string
  ): Promise<R> {
    // Apply metadata for creating the document
    const metaData = data as IDocumentMetaData;
    metaData.meta = {
      created: {
        by: getAuthorizedUserName(),
        at: fs.Timestamp.now()
      }
    };
    // The document instance to be created
    let document: R;
    // If there is an id specified, create the document with that ID
    if (id) {
      // Create the firestore document
      await fs.setDoc(fs.doc(firestore, path, id), data);
      // Create the new document instance
      document = creator({ id: id, path: path, data: data });
    }
    // If no ID is specified let Firestore create a new one
    else {
      // Create the firestore document
      const reference = await fs.addDoc(fs.collection(firestore, path), data);
      // Create the new document instance
      document = creator({ documentRef: reference, data: data });
    }
    // Logging
    Logging.debug('FirestoreDocument#create', document);
    // Return the new document instance
    return document;
  }

  /**
   * Update a Firestore document and apply optional data processing.
   *
   * @param {R} document - The document to be updated.
   * @param {function} [processor] - Optional data processing function to be applied before updating the document.
   *                                Takes the document's data as input and returns processed data.
   * @param {D} data - Optional data used for update instead of the document data
   *
   * @return {Promise<void>} - A Promise that resolves when the document has been successfully updated.
   *
   * @template D The type of the document data.
   * @template R The type of the document instance.
   */
  static async update<D extends object, R extends FirestoreDocument<D>>(
    document: R,
    processor?: (data: D) => D,
    data?: D
  ): Promise<void> {
    // Logging
    Logging.debug('FirestoreDocument#update', document);
    // Apply metadata for altering the document
    const metaData = document.data as IDocumentMetaData;
    if (metaData.meta) {
      metaData.meta.altered = {
        by: getAuthorizedUserName(),
        at: fs.Timestamp.now()
      };
    }
    // Process data before updating the document
    let _data = data ? data : document.data;
    if (processor) {
      _data = processor(_data);
    }
    // Update the document
    await fs.updateDoc(fs.doc(firestore, document.path + '/' + document.id), _data);
  }

  /**
   * Deletes a Firestore document.
   *
   * @param {R} document - The document to be deleted.
   *
   * @returns {Promise<void>} - A promise that resolves once the document is deleted.
   *
   * @template D The type of the document data.
   * @template R The type of the document instance.
   */
  static async delete<D extends object, R extends FirestoreDocument<D>>(
    document: R
  ): Promise<void> {
    // Logging
    Logging.debug('FirestoreDocument#delete', document);
    // Delete the document
    await fs.deleteDoc(fs.doc(firestore, document.path + '/' + document.id));
  }

  /**
   * Loads a Firestore document from the specified path and id.
   *
   * @param {string} path - The path to the Firestore collection.
   * @param {string} id - The document ID.
   * @param {function} creator - A function that creates the document object based on the Firestore document snapshot.
   * @param {function} [processor] - An optional function to process the loaded document object.
   *
   * @returns {Promise<R>} - A promise that resolves with the loaded document object.
   *
   * @throws {Error} - Throws an error if no document is found in Firestore with the provided path and id.
   *
   * @template D The type of the document data.
   * @template R The type of the document instance.
   */
  static async load<D extends object, R extends FirestoreDocument<D>>(
    path: string,
    id: string,
    creator: (config: TFirestoreDocumentConfig<D>) => R,
    processor?: (document: R) => Promise<void> | void
  ): Promise<R> {
    // Create the document reference
    const documentRef = fs.doc(firestore, path, id);
    // Load the document from firestore
    const snapshot = await fs.getDoc(documentRef);
    // Check, if the document exists
    if (snapshot.exists()) {
      // Create the document object
      const document = creator({ document: snapshot });
      // Process the document
      if (processor) {
        processor(document);
      }
      // Logging
      Logging.debug('FirestoreDocument#load', document);
      // Return the document
      return document;
    }
    // Throw an exception
    throw new Error(`No document found in firestore in path "${path}/${id}" found.`);
  }

  /**
   * Queries Firestore for documents based on the given path and constraints.
   *
   * @param {string} path - The path to the Firestore collection.
   * @param {function} creator - A function that creates a FirestoreDocument object.
   * @param {Project} [project] - The project the documents are queried for.
   * @param {function} [processor] - An optional function to process the FirestoreDocument objects.
   * @param {...fs.QueryConstraint} constraints - Optional constraints to filter the query.
   *
   * @returns {Promise<Map<string, R>>} - A Promise that resolves to a Map containing the queried FirestoreDocument objects.
   *
   * @template D The type of the document data.
   * @template R The type of the document instance.
   */
  static async query<D extends object, R extends FirestoreDocument<D>>(
    path: string,
    creator: (config: TFirestoreDocumentConfig<D>) => R,
    project?: Project,
    processor?: (data: D, project?: Project) => Promise<void> | void,
    ...constraints: fs.QueryConstraint[]
  ): Promise<Map<string, R>> {
    // Create the Firestore query object
    const query = fs.query(
      fs.collection(firestore, path),
      ...constraints
    );
    // Retrieve query snapshot
    const snapshot = await fs.getDocs(query);
    // Create result map
    const result = new Map<string, R>();
    // Iterate over all documents of the query
    for (let i = 0; i < snapshot.size; i++) {
      // Get document
      const firestoreDocument = snapshot.docs[i];
      // Create document object
      const document = creator({ document: firestoreDocument });
      // Process document after loading
      if (processor) {
        await processor(document.data, project);
      }
      // Add document to map
      result.set(document.id, document);
    }
    // Log result
    Logging.debug('FirestoreDocument#query', `${result.size} documents loaded from path "${path}"`);
    // Return the result map
    return result;
  }

  /**
   * Extracts the parent path from the given path.
   *
   * @param {string} path - The path to extract the parent path from.
   *
   * @returns {string} - The parent path of the given path.
   */
  static extractParentPath(path: string): string {
    const splitted: string[] = path.split('/');
    return splitted.slice(0, splitted.length - 1).join('/');
  }

  /**
   * Extracts the document type from the given path.
   *
   * @param {string} path - The path from which to extract the document type.
   *
   * @returns {EDocumentType} - The extracted document type.
   */
  private static extractDocumentType(path: string): tp.EDocumentType {
    const splitted: string[] = path.split('/');
    return splitted[splitted.length - 1] as tp.EDocumentType;
  }
}
