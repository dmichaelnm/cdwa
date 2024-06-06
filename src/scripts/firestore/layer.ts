import * as fd from 'src/scripts/firestore/firestore-document';
import * as tp from 'src/scripts/util/types';
import { NodeDocument } from 'src/scripts/firestore/node-document';
import { Project } from 'src/scripts/firestore/project';
import { TSelectionOption } from 'src/scripts/config/options';
import { ProjectDocument } from 'src/scripts/firestore/project-document';

/**
 * Enum representing the types of layers used in the application.
 */
export enum ELayerType {
  // File Storage
  fileStorage = 'fileStorage',
  // Database - 3NF
  database3NF = 'database3NF',
  // Database - Data Vault
  databaseVault = 'databaseVault',
  // Database - Mart
  databaseMart = 'databaseMart'
}

/**
 * Retrieves the available layer type options.
 *
 * @returns {TSelectionOption<ELayerType>} An array of layer type options.
 */
export function getLayerTypeOptions(): TSelectionOption<ELayerType>[] {
  return [
    { value: ELayerType.fileStorage, label: 'enum.layer.fileStorage', icon: 'mdi-server-network' },
    { value: ELayerType.database3NF, label: 'enum.layer.database3NF', icon: 'mdi-database-outline' },
    { value: ELayerType.databaseVault, label: 'enum.layer.databaseVault', icon: 'mdi-database-clock-outline' },
    { value: ELayerType.databaseMart, label: 'enum.layer.databaseMart', icon: 'mdi-chart-line' }
  ];
}

/**
 * Interface representing the data for a layer in a document.
 */
export interface ILayerData extends fd.IDocumentCommonData, fd.IDocumentAttributeData, fd.IDocumentMetaData {
  // The type of the layer
  type: ELayerType;
}

/**
 * Represents a layer object.
 *
 * @extends {NodeDocument<ILayerData>}
 * @implements {INamed}
 */
export class Layer extends NodeDocument<ILayerData> implements tp.INamed {

  /**
   * Returns the name from the object's data.
   *
   * @return {string} The name of the object.
   */
  getName(): string {
    return this.data.common.name;
  }

  /**
   * Creates tree nodes of all layers for a given project.
   *
   * @param {Project} project - The project object.
   *
   * @returns {TTreeNode} - The root node of the tree.
   */
  static createTreeNodes(project: Project): tp.TTreeNode {
    // Root node for layers
    const root: tp.TTreeNode = {
      key: 'layers',
      type: tp.EDocumentType.layer,
      label: 'layer.plural',
      icon: 'mdi-layers-triple-outline',
      document: undefined,
      translate: true,
      permission: (mode: tp.EEditorMode) => {
        if (mode === tp.EEditorMode.create) {
          // All but visitors can create layers
          return !project.hasRole(tp.EProjectMemberRole.visitor);
        }
        // No permission
        return false;
      },
      children: []
    };
    // Add layer nodes
    const layers = project.getLayers();
    layers.forEach(layer => root.children?.push({
      key: layer.id,
      type: tp.EDocumentType.layer,
      label: layer.data.common.name,
      icon: getLayerTypeOptions().find(l => l.value === layer.data.type)?.icon,
      document: layer,
      draggable: true,
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
   * Creates a layer for a given project.
   *
   * @param {Project} project - The project in which the layer will be created.
   * @param {string} name - The name of the layer.
   * @param {string | null} description - The description of the layer (optional).
   * @param {ELayerType} type - The type of the layer.
   * @param {TDocumentAttribute[]} attributes - The attributes of the layer.
   *
   * @return {Promise<Layer>} A promise that resolves to the created layer.
   */
  static async createLayer(
    project: Project,
    name: string,
    description: string | null,
    type: ELayerType,
    attributes: tp.TDocumentAttribute[]
  ): Promise<Layer> {
    // Create data structure
    const data: ILayerData = {
      common: { name: name, description: description },
      type: type,
      attributes: attributes
    };
    // Create and return layer document
    return await ProjectDocument.createProjectDocument<ILayerData, Layer>(
      project,
      tp.EDocumentType.layer,
      data,
      (config) => new Layer(config, project)
    );
  }

  /**
   * Loads layers for a given project.
   *
   * @param {Project} project - The project object for which to load the layers.
   *
   * @return {Promise<void>} - A promise that resolves once the layers are loaded and added to the project.
   */
  static async loadLayers(project: Project): Promise<void> {
    // Load the layers
    const layers = await fd.FirestoreDocument.query<ILayerData, Layer>(
      project.getFullPath() + tp.EDocumentType.layer,
      (config) => new Layer(config, project),
      project
    );
    // Add layers to project
    project.setDocuments(tp.EDocumentType.layer, layers);
  }
}
