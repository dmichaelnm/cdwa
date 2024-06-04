import * as fd from 'src/scripts/firestore/firestore-document';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { EDocumentType, IIdentifiable, INamed, TTreeNode } from 'src/scripts/util/types';
import { Project } from 'src/scripts/firestore/project';
import { getDiagramTypeIcon } from 'src/scripts/util/utilities';

/**
 * Enumeration representing different types of diagrams.
 */
export enum EDiagramType {
  // Architecture
  architecture = 'architecture'
}

/**
 * Represents a handle on a diagram node.
 */
export type TDiagramHandle = {
  // The ID of the opposite node
  id: string;
  // The handle
  handle: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Represents an edge in a diagram.
 */
export interface IDiagramEdge {
  // Source ID and handle
  source: TDiagramHandle;
  // Target ID and handle
  target: TDiagramHandle;
}

/**
 * Represents a diagram node in a document.
 *
 * @extends IIdentifiable
 */
export interface IDiagramNode extends IIdentifiable {
  // The ID of the document represented by this node
  id: string;
  // Type of document represented by this node
  type: EDocumentType;
  // Sub nodes contained by this node.
  nodes: IDiagramNode[];
  // Edges of the sub node
  edges: IDiagramEdge[];
  // Parent node
  parent?: IDiagramNode;
}

/**
 * Represents the data structure of a diagram.
 */
export interface IDiagramData extends fd.IDocumentCommonData, fd.IDocumentMetaData {
  // Type of the diagram
  type: EDiagramType;
  // Root nodes of this diagram
  nodes: IDiagramNode[];
  // Root edges of this diagram
  edges: IDiagramEdge[];
  // Viewport of the diagram
  viewport: {
    // X Offset
    x: number;
    // Y Offset
    y: number;
    // Zoom Factor
    zoom: number;
  }
}

/**
 * Represents a Diagram document.
 *
 * @extends ProjectDocument
 * @implements INamed
 */
export class Diagram extends ProjectDocument<IDiagramData> implements INamed {

  /**
   * Returns the name of the diagram.
   *
   * @returns {string} The name of the diagram.
   */
  getName(): string {
    return this.data.common.name;
  }

  /**
   * Creates a tree node containing diagram nodes for a given project.
   *
   * @param {Project} project - The project for which to create the tree node.
   *
   * @return {TTreeNode} The tree node representing the project.
   */
  static createTreeNode(project: Project): TTreeNode {
    // Root node for diagrams
    const root: TTreeNode = {
      key: 'diagrams',
      type: EDocumentType.diagram,
      label: 'diagram.plural',
      icon: 'mdi-sitemap',
      header: 'translate',
      document: undefined,
      translate: true,
      children: []
    };
    // Add diagram nodes
    const diagrams = project.getDiagrams();
    diagrams.forEach(diagram => root.children?.push({
      key: diagram.id,
      type: EDocumentType.diagram,
      label: diagram.data.common.name,
      icon: getDiagramTypeIcon(diagram.data.type),
      header: 'document',
      document: diagram,
      draggable: true,
      children: []
    }));
    // Return root node
    return root;
  }

  /**
   * Creates a new diagram within a project.
   *
   * @param {Project} project - The project in which to create the diagram.
   * @param {string} name - The name of the diagram.
   * @param {string | null} description - The optional description of the diagram.
   * @param {EDiagramType} type - The type of the diagram.
   *
   * @returns {Promise<Diagram>} - A promise that resolves to the created diagram.
   */
  static async createDiagram(
    project: Project,
    name: string,
    description: string | null,
    type: EDiagramType
  ): Promise<Diagram> {
    // Create data structure
    const data: IDiagramData = {
      common: { name: name, description: description },
      type: type,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    };
    // Create and return diagram document
    return await ProjectDocument.createProjectDocument<IDiagramData, Diagram>(
      project,
      EDocumentType.diagram,
      data,
      (config) => new Diagram(config, project)
    );
  }

  /**
   * Load diagrams for a given project.
   *
   * @param {Project} project - The project to load diagrams for.
   *
   * @return {Promise<void>} A promise that resolves once the diagrams have been loaded and added to the project.
   */
  static async loadDiagrams(project: Project): Promise<void> {
    // Load the diagrams
    const diagrams = await FirestoreDocument.query<IDiagramData, Diagram>(
      project.getFullPath() + EDocumentType.diagram,
      (config) => new Diagram(config, project),
      project
    );
    // Add diagrams to project
    project.setDocuments(EDocumentType.diagram, diagrams);
  }
}
