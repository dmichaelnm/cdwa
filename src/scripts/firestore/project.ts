import * as fd from 'src/scripts/firestore/firestore-document';
import * as tp from 'src/scripts/util/types';
import * as fs from 'firebase/firestore';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { getAuthorizedUserId } from 'src/scripts/util/firebase';
import { toArray } from 'src/scripts/util/utilities';
import { Connection, IConnectionData } from 'src/scripts/firestore/connection';
import { Diagram, IDiagramData } from 'src/scripts/firestore/diagram';

/**
 * Represents a project member.
 */
export type TProjectMember = {
  // The ID of the account of the member
  accountId: string;
  // Display name of the member
  displayName: string;
  // Array of IDs of roles of the member
  role: tp.EProjectMemberRole;
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
   * Retrieves a document of the specified type and ID from the project.
   *
   * @param {EDocumentType} type - The type of the document.
   * @param {string} id - The ID of the document.
   *
   * @returns {R} - The retrieved document of type R.
   *
   * @throws {Error} - If the document is not found.
   *
   * @template D - The type if data structure of the document
   * @template R - The type of the document
   */
  getDocument<D extends object, R extends ProjectDocument<D>>(
    type: tp.EDocumentType,
    id: string
  ): R {
    // Get the map with documents of the expected type
    const map = this.getDocuments<D>(type);
    // Check, if the expected ID exists in the map
    if (map.has(id)) {
      // Return the document
      return map.get(id) as R;
    }
    // Not found, throw an exception
    throw new Error(`Document of type "${type}" and ID "${id}" not found in project "${this.getName()}.`);
  }

  /**
   * Gets the documents of the specified type.
   *
   * @param {tp.EDocumentType} type - The type of the documents to retrieve.
   *
   * @returns {Map<string, ProjectDocument<D>>} - A map containing the retrieved documents.
   *
   * @template D - The type of the document object.
   */
  getDocuments<D extends object>(type: tp.EDocumentType): Map<string, ProjectDocument<D>> {
    if (this.children.has(type)) {
      return this.children.get(type) as Map<string, ProjectDocument<D>>;
    }
    // Return an empty map
    return new Map<string, ProjectDocument<D>>();
  }

  /**
   * Sets the documents for a specific type.
   *
   * @param {tp.EDocumentType} type - The type of the documents to be set.
   * @param {Map<string, ProjectDocument<D>>} documents - The documents to be set.
   *
   * @return {void}
   */
  setDocuments<D extends object>(type: tp.EDocumentType, documents: Map<string, ProjectDocument<D>>): void {
    this.children.set(type, documents);
  }

  /**
   * Removes a document from the project.
   *
   * @param {FirestoreDocument} document - The document to be removed.
   *
   * @return {void}
   */
  removeDocument<D extends object>(document: fd.FirestoreDocument<D>): void {
    const documents = this.getDocuments(document.type);
    documents.delete(document.id);
  }

  /**
   * Retrieves an array of diagrams from the documents.
   *
   * @return {Diagram[]} The array of diagrams.
   */
  getDiagrams(): Diagram[] {
    return toArray(
      this.getDocuments<IDiagramData>(tp.EDocumentType.diagram),
      (d1, d2) => {
        const n1 = d1.data.common.name.toLowerCase();
        const n2 = d2.data.common.name.toLowerCase();
        return n1.localeCompare(n2);
      }
    ) as Diagram[];
  }

  /**
   * Returns an array of Connection objects.
   *
   * @returns {Connection[]} An array of Connection objects.
   */
  getConnections(): Connection[] {
    return toArray(
      this.getDocuments<IConnectionData>(tp.EDocumentType.connection),
      (c1, c2) => {
        const n1 = c1.data.common.name.toLowerCase();
        const n2 = c2.data.common.name.toLowerCase();
        return n1.localeCompare(n2);
      }
    ) as Connection[];
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
   * Returns the owner of the project.
   *
   * @returns {TProjectMember} The owner of the project.
   *
   * @throws {Error} Throws an error if the project has no owner.
   */
  getOwner(): TProjectMember {
    // Get the owner
    const owner = this.data.members.find(mbr => mbr.role === tp.EProjectMemberRole.owner);
    if (owner) {
      // Return the owner
      return owner;
    }
    // Project has no owner
    throw new Error(`Project "${this.getName()} has no owner.`);
  }

  /**
   * Returns the manager of the project.
   *
   * @returns {TProjectMember} The manager of the project.
   *
   * @throws {Error} If the project has no manager.
   */
  getManager(): TProjectMember {
    // Get the manager
    const manager = this.data.members.find(mbr => mbr.role === tp.EProjectMemberRole.manager);
    if (manager) {
      // Return the manager
      return manager;
    }
    // Project has no owner
    throw new Error(`Project "${this.getName()} has no manager.`);
  }

  /**
   * Retrieves the role of the authorized user in the project.
   *
   * @returns {tp.EProjectMemberRole} The role of the authorized user.
   *
   * @throws {Error} Throws an error if the authorized user is not a member of the project.
   */
  getOwnRole(): tp.EProjectMemberRole {
    // Get current user ID
    const id = getAuthorizedUserId();
    // Get role for ID
    const member = this.data.members.find(mbr => mbr.accountId === id);
    if (member) {
      // Return role
      return member.role;
    }
    // No member found
    throw new Error(`No member with ID "${id}" found in project "${this.getName()}".`);
  }

  /**
   * Checks if the current user has any of the specified roles.
   *
   * @param {...tp.EProjectMemberRole[]} roles - The roles to check.
   *
   * @return {boolean} - True if the current user has any of the specified roles, false otherwise.
   */
  hasRole(...roles: tp.EProjectMemberRole[]): boolean {
    // Get current user id
    const id = getAuthorizedUserId();
    // Find the project member
    const member = this.data.members.find(mbr => mbr.accountId === id);
    if (member) {
      // Check if one of the roles apply
      return roles.some(r => r === member.role);
    }
    // Member not found
    return false;
  }

  /**
   * Creates a new project with the given information.
   *
   * @param {string} name - The name of the project.
   * @param {string | null} description - The description of the project. Can be null.
   * @param {TProjectMember[]} members - The members of the project.
   * @param {TDocumentAttribute[]} attributes - The attributes of the project.
   *
   * @returns {Promise<Project>} - A Promise that resolves with the created project.
   */
  static async createProject(
    name: string,
    description: string | null,
    members: TProjectMember[],
    attributes: tp.TDocumentAttribute[]
  ): Promise<Project> {
    // Create the data structure for the project
    const data: IProjectData = {
      access: Project.createAccessList(members),
      common: { name: name, description: description },
      members: members,
      attributes: attributes
    };
    // Create the project document
    return await fd.FirestoreDocument.createDocument(
      tp.EDocumentType.project as string,
      data,
      (config) => new Project(config)
    );
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
        data.access = Project.createAccessList(project.data.members);
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
    const map = await fd.FirestoreDocument.query<IProjectData, Project>(
      tp.EDocumentType.project,
      (config) => new Project(config),
      undefined,
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
   * Loads a project from Firestore based on the given projectId.
   *
   * @param {string} projectId - The ID of the project to load.
   *
   * @returns {Promise<Project>} - A promise that resolves to a Project object representing the loaded project.
   */
  static async loadProject(projectId: string): Promise<Project> {
    // Load the project document from Firestore
    const project = await fd.FirestoreDocument.load<IProjectData, Project>(
      tp.EDocumentType.project,
      projectId,
      (config) => new Project(config)
    );
    // Load all connections
    await Connection.loadConnections(project);
    // Load all diagrams
    await Diagram.loadDiagrams(project);
    // Return the project
    return project;
  }

  /**
   * Creates an access list based on the given member array.
   *
   * @param {TProjectMember[]} memberArray - An array of project members.
   *
   * @return {string[]} - The access list containing unique account IDs.
   */
  private static createAccessList(memberArray: TProjectMember[]): string[] {
    return [...new Set<string>(memberArray.map(mbr => mbr.accountId))];
  }
}
