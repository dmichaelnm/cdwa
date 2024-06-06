import { defineStore } from 'pinia';
import { Account } from 'src/scripts/firestore/account';
import { Project } from 'src/scripts/firestore/project';
import { TDragOperation } from 'src/scripts/util/types';

export const useSessionStore = defineStore('session', {
  state: () => ({
    // The authorized account
    account: null as Account | null,
    // Array of accessible projects
    projects: [] as Project[],
    // Active project
    project: null as Project | null,
    // Editor Lock
    editorLock: false as boolean,
    // Query parameter
    queryParams: {} as any,
    // ID of the current diagram
    currentDiagramId: null as string | null,
    // Splitter position in model page
    splitter: 20 as number,
    // Keys of expanded tree nodes
    expandedNodeKeys: [] as string[],
    // Infos of the current drag operation
    dragOperation: null as TDragOperation | null
  }),
  getters: {
    /**
     * Returns the active account.
     *
     * @returns {Account} The active account.
     *
     * @throws {Error} If no active account is found in the session store.
     */
    accountActive(): Account {
      if (this.account) {
        return this.account;
      }
      throw new Error('No active account found in session store!');
    },
    /**
     * Returns the display name of the account.
     *
     * @returns {string} The display name of the account. If the account is null or undefined, it returns an empty string.
     */
    accountDisplayName(): string {
      return this.account ? this.account.getName() : '';
    }
  },
  actions: {
    /**
     * Retrieves a project based on the given project ID.
     *
     * @param {string | null} projectId - The ID of the project to be retrieved.
     *
     * @return {Project | null} - The retrieved project or null if no project is found.
     */
    getProject(projectId: string | null): Project | null {
      if (projectId === null) {
        return null;
      } else {
        const project = this.projects.find(prj => prj.id === projectId);
        return project ? project as Project : null;
      }
    },
    /**
     * Removes a project from the list of projects.
     *
     * @param {string} projectId - The ID of the project to be removed.
     *
     * @return {void}
     */
    removeProject(projectId: string): void {
      const index = this.projects.findIndex(p => p.id === projectId);
      if (index > -1) {
        this.projects.splice(index, 1);
      }
    },
    /**
     * Resets the session.
     *
     * @returns {void}
     */
    reset(): void {
      this.account = null;
      this.projects = [];
      this.project = null;
      this.editorLock = false;
      this.queryParams = {};
      this.currentDiagramId = null;
      this.splitter = 20;
      this.expandedNodeKeys = [];
    }
  }
});
