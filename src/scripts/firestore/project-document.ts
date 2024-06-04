import * as fd from 'src/scripts/firestore/firestore-document';
import { Project } from 'src/scripts/firestore/project';

/**
 * Represents a Firestore document that is part of a project.
 *
 * @template D - The type of data contained within the document.
 */
export class ProjectDocument<D extends object> extends fd.FirestoreDocument<D> {

  /**
   * Represents the project that contains this document.
   */
  project: Project;

  /**
   * Creates a new instance of a firestore document that is part of a project.
   *
   * @param {TFirestoreDocumentConfig<D>} config - The configuration object for the document.
   * @param {Project} project - The project containing this document.
   *
   * @template D - The type of the data object.
   */
  constructor(config: fd.TFirestoreDocumentConfig<D>, project: Project) {
    super(config);
    this.project = project;
  }

  /**
   * Creates a new project document.
   *
   * @param {Project} project - The project to create the document in.
   * @param {string} path - The path of the document within the project.
   * @param {D} data - The data to store in the document.
   * @param {function} creator - A creator function that creates an instance of ProjectDocument.
   * @param {function} [processor] - An optional function to process the data before creation.
   *
   * @returns {Promise<R>} - A promise that resolves with the created project document.
   *
   * @template D - The type of the data object.
   * @template R - The type of the document.
   */
  static async createProjectDocument<D extends object, R extends ProjectDocument<D>>(
    project: Project,
    path: string,
    data: D,
    creator: (config: fd.TFirestoreDocumentConfig<D>) => R,
    processor?: (data: D, project: Project) => Promise<D> | D
  ): Promise<R> {
    // Process data prior to creation
    const processedData = processor ? await processor(data, project) : data;
    // Create and return the document
    return await fd.FirestoreDocument.createDocument<D, R>(
      project.getFullPath() + path,
      processedData,
      creator
    );
  }

  /**
   * Updates a document in Firestore.
   *
   * @param {R} document - The document to be updated.
   * @param {Function} [processor] - An optional processor function that performs additional operations on the document data.
   *                                Must be an async function that takes in the document data and the project as parameters.
   * @param {D} data - Optional data that is used instead of the document data
   *
   * @returns {Promise<void>} - A promise that resolves when the document update is complete.
   *
   * @template D - The type of the data object.
   * @template R - The type of the document.
   */
  static async updateDocument<D extends object, R extends ProjectDocument<D>>(
    document: R,
    processor?: (data: D, project: Project) => Promise<D> | D,
    data?: D
  ): Promise<void> {
    // Process document data, if processor is provided
    const _data = data ? data : document.data;
    const processedData = processor ? await processor(_data, document.project) : _data;
    // Update the document in Firestore
    await fd.FirestoreDocument.update<D, R>(document, undefined, processedData);
  }

  /**
   * Deletes a document from a project.
   *
   * @param {ProjectDocument<any>} document - The document to be deleted.
   *
   * @return {Promise<void>} - A promise that resolves when the document is successfully deleted.
   */
  static async deleteDocument(document: ProjectDocument<any>): Promise<void> {
    // Delete the diagram document
    await fd.FirestoreDocument.delete(document);
    // Remove diagram from project
    document.project.removeDocument(document);
  }
}
