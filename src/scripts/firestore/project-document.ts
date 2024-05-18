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
   */
  constructor(config: fd.TFirestoreDocumentConfig<D>, project: Project) {
    super(config);
    this.project = project;
  }
}
