import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';

/**
 * Represents a node document that extends the ProjectDocument class.
 */
export class NodeDocument<D extends object> extends ProjectDocument<D> {

  /**
   * Retrieves the default dimension.
   *
   * @returns {Object} The default dimension object containing width and height properties.
   *
   * @throws {Error} If the method is not implemented.
   */
  getDefaultDimension(): { width: number; height: number } {
    throw new Error('Method not implemented.');
  }

  /**
   * Checks if this document is droppable at the given target.
   *
   * @param {FirestoreDocument<any> | null} target - The target to be checked.
   *
   * @return {boolean} - Returns `true` if this document is droppable, otherwise `false`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDroppable(target: FirestoreDocument<any> | null): boolean {
    throw new Error('Method not implemented.');
  }
}
