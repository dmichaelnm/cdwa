import * as fd from 'src/scripts/firestore/firestore-document';
import * as tp from 'src/scripts/util/types';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { Project } from 'src/scripts/firestore/project';

/**
 * Represents the data for a role.
 */
export interface IRoleData extends fd.IDocumentCommonData, fd.IDocumentMetaData {
  // Permissions of this role
  permissions: tp.EPermission[];
}

/**
 * Represents a Role defining the permissions in a project.
 *
 * @extends ProjectDocument
 * @implements INamed
 */
export class Role extends ProjectDocument<IRoleData> implements tp.INamed {

  /**
   * Retrieves the name of this role.
   *
   * @returns {string} The name of the role.
   */
  getName(): string {
    return this.data.common.name;
  }

  /**
   * Creates a new role for a project.
   *
   * @param {Project} project - The project to create the role for.
   * @param {string} name - The name of the role.
   * @param {string | null} description - The description of the role (optional).
   * @param {EPermission[]} permissions - The permissions assigned to the role.
   *
   * @returns {Promise<Role>} - A promise that resolves to the created role.
   */
  static async createRole(
    project: Project,
    name: string,
    description: string | null,
    permissions: tp.EPermission[]
  ): Promise<Role> {
    // Create data structure for role
    const data: IRoleData = {
      common: { name: name, description: description },
      permissions: permissions
    };
    // Create and return the role document
    return fd.FirestoreDocument.create(
      project.getFullPath() + tp.EDocumentType.role,
      data,
      (config) => new Role(config, project)
    );
  }
}
