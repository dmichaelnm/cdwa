import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';

export class NodeDocument<D extends object> extends ProjectDocument<D> {

  /**
   * Checks if this document is droppable at the given target.
   *
   * @param {FirestoreDocument<any> | null} target - The target to be checked.
   *
   * @return {boolean} - Returns `true` if this document is droppable, otherwise `false`.
   */
  isDroppable(target: FirestoreDocument<any> | null): boolean {
    return false;
  }
}
