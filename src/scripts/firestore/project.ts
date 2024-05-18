import * as fd from 'src/scripts/firestore/firestore-document';
import * as tp from 'src/scripts/util/types';
import * as fs from 'firebase/firestore';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { Account } from 'src/scripts/firestore/account';
import { Role } from 'src/scripts/firestore/role';
import { getAuthorizedUserId } from 'src/scripts/util/firebase';
import { toArray } from 'src/scripts/util/utilities';

/**
 * Represents a project member.
 */
export type TProjectMember = {
  // The ID of the account of the member
  accountId: string;
  // Display name of the member
  displayName: string;
  // Array of IDs of roles of the member
  roles?: string[];
}

/**
 * Represents the data for a project.
 *
 * @extends {IDocumentCommonData}
 * @extends {IDocumentMetaData}
 */
export interface IProjectData extends fd.IDocumentCommonData, fd.IDocumentMetaData, fd.IDocumentAttributeData {
  // Array of account IDs with access to this project
  access?: string[];
  // The owner of the project
  owner: TProjectMember;
  // The manager of the project
  manager: TProjectMember;
  // Array of project members
  members: TProjectMember[];
}

/**
 * Represents a Project.
 *
 * @extends FirestoreDocument
 * @implements tp.INamed
 */
export class Project extends fd.FirestoreDocument<IProjectData> implements tp.INamed {

  /**
   * Represents a collection of project documents for different document types.
   */
  private children: Map<tp.EDocumentType, Map<string, ProjectDocument<any>>> = new Map();

  /**
   * Adds a document to the project.
   *
   * @param {R} document - The document to be added to the project.
   *
   * @returns {void}
   *
   * @throws {Error} If the document is already part of the project.
   *
   * @template D - The type if data structure of the document
   * @template R - The type of the document
   */
  addDocument<D extends object, R extends ProjectDocument<D>>(
    document: R
  ): void {
    // Get the type of the document
    const type = document.type;
    // Get the array of documents from the project
    const documents = this.children.has(type)
      ? this.children.get(type) as Map<string, R>
      : new Map<string, R>();
    // Check, if document isn't already in the array
    if (documents.has(document.id)) {
      // Throw an error
      throw new Error(`Document "${document.id}(${document.type})" already part of the project "${this.getName()}. `);
    }
    // Add the document
    documents.set(document.id, document);
    this.children.set(type, documents);
  }

  /**
   * Returns the name of the project.
   *
   * @returns {string} The name of the project.
   */
  getName(): string {
    return this.data.common.name;
  }

  /**
   * Creates a new project with the given information.
   *
   * @param {string} name - The name of the project.
   * @param {string | null} description - The description of the project. Can be null.
   * @param {Account} owner - The owner of the project.
   * @param {Account} manager - The project manager.
   * @param {TDocumentAttribute[]} attributes - The attributes of the project.
   * @param {string} visitorRoleName - The name of the role for visitors.
   * @param {string | null} visitorRoleDescription - The description of the role for visitors. Can be null.
   *
   * @returns {Promise<Project>} - A Promise that resolves with the created project.
   */
  static async createProject(
    name: string,
    description: string | null,
    owner: Account,
    manager: Account,
    attributes: tp.TDocumentAttribute[],
    visitorRoleName: string,
    visitorRoleDescription: string | null
  ): Promise<Project> {
    // Create the data structure for the project
    const data: IProjectData = {
      access: Project.createAccessList(
        owner.id,
        manager.id
      ),
      common: { name: name, description: description },
      owner: { accountId: owner.id, displayName: owner.getName() },
      manager: { accountId: manager.id, displayName: manager.getName() },
      members: [],
      attributes: attributes
    };
    // Create the project document
    const project = await fd.FirestoreDocument.create(
      tp.EDocumentType.project as string,
      data,
      (config) => new Project(config)
    );
    // Create a role without permissions for visitors
    const role = await Role.createRole(
      project,
      visitorRoleName,
      visitorRoleDescription,
      []
    );
    // Add role to project
    project.addDocument(role);
    // Return the project
    return project;
  }

  /**
   * Updates the given project with new data.
   *
   * @param {Project} project - The project to be updated.
   *
   * @return {Promise<void>} - A Promise that resolves when the project is successfully updated.
   */
  static async updateProject(project: Project): Promise<void> {
    await fd.FirestoreDocument.update(
      project,
      (data: IProjectData) => {
        // Refresh the access list
        data.access = Project.createAccessList(
          data.owner.accountId,
          data.manager.accountId
        );
        return data;
      }
    );
  }

  /**
   * Loads the projects from Firestore based on the user's authorization.
   *
   * @returns {Promise<Project[]>} - A promise that resolves to an array of Project objects.
   */
  static async loadProjects(): Promise<Project[]> {
    // Retrieve the map of visible projects from Firestore
    const map = await fd.FirestoreDocument.query(
      tp.EDocumentType.project,
      (config: fd.TFirestoreDocumentConfig<IProjectData>) => new Project(config),
      undefined,
      fs.where('access', 'array-contains', getAuthorizedUserId())
    );
    // Convert the map into an array and return the array
    return toArray(
      map,
      (p1: Project, p2: Project) => p1.getName().localeCompare(p2.getName())
    );
  }

  /**
   * Creates an access list based on the provided account IDs.
   *
   * @param {string[]} accountIDs - The account IDs to create the access list from.
   *
   * @return {string[]} - The access list created from the provided account IDs.
   */
  private static createAccessList(...accountIDs: string[]): string[] {
    return [...new Set<string>(accountIDs)];
  }
}
