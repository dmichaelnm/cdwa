import * as fd from 'src/scripts/firestore/firestore-document';
import * as tp from 'src/scripts/util/types';
import { FirestoreDocument } from 'src/scripts/firestore/firestore-document';
import { ProjectDocument } from 'src/scripts/firestore/project-document';
import { Project } from 'src/scripts/firestore/project';
import { getDiagramTypeIcon } from 'src/scripts/util/utilities';
import { NodeDocument } from 'src/scripts/firestore/node-document';
import { Node } from '@vue-flow/core';

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
export interface IDiagramNode extends tp.IIdentifiable {
  // The ID of the document represented by this node
  id: string;
  // Type of document represented by this node
  type: tp.EDocumentType;
  // Position of the node
  position: { x: number; y: number };
  // Dimension of the node
  dimension: { width: number; height: number };
  // Sub nodes contained by this node.
  nodes: IDiagramNode[];
  // Edges of the sub node
  edges: IDiagramEdge[];
  // Parent node
  parent: IDiagramNode | null;
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
  };
}

/**
 * Represents a Diagram document.
 *
 * @extends ProjectDocument
 * @implements INamed
 */
export class Diagram extends ProjectDocument<IDiagramData> implements tp.INamed {

  /**
   * Adds a new node to the diagram.
   *
   * @param {NodeDocument<any>} source - The source node document to add.
   * @param {NodeDocument<any> | null} target - The target node document where the new node will be added. Use null if the new node should be added to the diagram's root.
   * @param {{ x: number; y: number }} position - The position of the new node.
   *
   * @returns {IDiagramNode} - The newly added node.
   */
  addNode(
    source: NodeDocument<any>,
    target: NodeDocument<any> | null,
    position: { x: number; y: number },
  ): IDiagramNode {
    // Get parent node
    const parent = target !== null ? this.getNode(target.id) : null;
    const nodeArray = parent ? parent.nodes : this.data.nodes;
    // Create new node
    const node: IDiagramNode = {
      id: source.id,
      type: source.type,
      position: position,
      dimension: source.getDefaultDimension(),
      nodes: [],
      edges: [],
      parent: parent
    };
    // Add node
    nodeArray.push(node);
    // Return new node
    return node;
  }

  /**
   * Returns the name of the diagram.
   *
   * @returns {string} The name of the diagram.
   */
  getName(): string {
    return this.data.common.name;
  }

  /**
   * Retrieves a node with the given ID from a parent node or the root node.
   *
   * @param {string} id - The ID of the node to retrieve.
   * @param {IDiagramNode} [parent] - The parent node to search within. If not provided, the search will be conducted within the root node.
   *
   * @return {IDiagramNode | undefined} - The node with the given ID, or null if not found.
   */
  getNode(id: string, parent?: IDiagramNode): IDiagramNode | null {
    // Get parent node array
    const nodes = parent ? parent.nodes : this.data.nodes;
    // Iterate over all nodes
    for (const node of nodes) {
      // Check if node has the given ID
      if (node.id === id) {
        // Return node
        return node;
      }
      // Check sub nodes
      const subNode = this.getNode(id, node);
      if (subNode) {
        // Sub node found
        return subNode;
      }
    }
    // Nothing found
    return null;
  }

  /**
   * Checks if the given node ID exists in the current context.
   *
   * @param {string} id - The ID of the node to check.
   *
   * @return {boolean} - True if the node exists, false otherwise.
   */
  hasNode(id: string): boolean {
    return this.getNode(id) !== null;
  }

  /**
   * Removes a node from the diagram.
   *
   * @param {string} id - The id of the node to be removed.
   * @param {IDiagramNode} [parent] - The parent node (optional). If not provided, the node will be removed from the top level of the diagram.
   *
   * @return {boolean} - Returns true if the node is successfully removed, false otherwise.
   */
  removeNode(id: string, parent?: IDiagramNode): boolean {
    // Get parent node array
    const nodes = parent ? parent.nodes : this.data.nodes;
    // Iterate over all nodes
    for (let i = nodes.length - 1; i >= 0; i--) {
      // Check node
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      // Check sub nodes
      if (this.removeNode(id, nodes[i])) {
        return true;
      }
    }
    // Nothing removed
    return false;
  }

  /**
   * Creates an array of Vue Flow nodes recursively based on the given parent diagram node.
   *
   * @param {IDiagramNode} parent - The parent diagram node. If not provided, the function uses the parent nodes from the data object.
   *
   * @returns {Node[]} - An array of Vue Flow nodes.
   */
  createVueFlowNodes(parent?: IDiagramNode): Node[] {
    // Create result array
    const nodes: Node[] = [];
    // Get parent diagram node array
    const parentArray = parent ? parent.nodes : this.data.nodes;
    for (const diagramNode of parentArray) {
      // Create Vue Flow node
      nodes.push({
        id: diagramNode.id,
        type: diagramNode.type,
        position: diagramNode.position,
        style: { width: `${diagramNode.dimension.width}px`, height: `${diagramNode.dimension.height}px` },
        data: this.project.getDocument(diagramNode.type, diagramNode.id)
      });
      // Create sub nodes
      nodes.push(...this.createVueFlowNodes(diagramNode));
    }
    // Return nodes array
    return nodes;
  }

  /**
   * Creates a tree node containing diagram nodes for a given project.
   *
   * @param {Project} project - The project for which to create the tree node.
   *
   * @return {TTreeNode} The tree node representing the project.
   */
  static createTreeNode(project: Project): tp.TTreeNode {
    // Root node for diagrams
    const root: tp.TTreeNode = {
      key: 'diagrams',
      type: tp.EDocumentType.diagram,
      label: 'diagram.plural',
      icon: 'mdi-sitemap',
      document: undefined,
      translate: true,
      permission: (mode: tp.EEditorMode) => {
        if (mode === tp.EEditorMode.create) {
          // All but visitors can create diagrams
          return !project.hasRole(tp.EProjectMemberRole.visitor);
        }
        // No permission
        return false;
      },
      children: []
    };
    // Add diagram nodes
    const diagrams = project.getDiagrams();
    diagrams.forEach(diagram => root.children?.push({
      key: diagram.id,
      type: tp.EDocumentType.diagram,
      label: diagram.data.common.name,
      icon: getDiagramTypeIcon(diagram.data.type),
      document: diagram,
      draggable: false,
      permission: (mode: tp.EEditorMode) => {
        if (mode === tp.EEditorMode.view) {
          // Visitors can view
          return project.hasRole(tp.EProjectMemberRole.visitor);
        }
        if (mode === tp.EEditorMode.edit || mode === tp.EEditorMode.delete) {
          // All but visitors can edit and delete
          return !project.hasRole(tp.EProjectMemberRole.visitor);
        }
        // No permissions
        return false;
      },
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
      tp.EDocumentType.diagram,
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
      project.getFullPath() + tp.EDocumentType.diagram,
      (config) => new Diagram(config, project),
      project
    );
    // Add diagrams to project
    project.setDocuments(tp.EDocumentType.diagram, diagrams);
  }
}
