import { defineStore } from 'pinia';
import { Account } from 'src/scripts/firestore/account';
import { Project } from 'src/scripts/firestore/project';

export const useSessionStore = defineStore('session', {
  state: () => ({
    // The authorized account
    account: null as Account | null,
    // Array of accessible projects
    projects: [] as Project[],
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
     * @param {string} projectId - The ID of the project to retrieve.
     *
     * @returns {Project} The project object matching the given project ID.
     *
     * @throws {Error} If no project is found for the given project ID.
     */
    getProject(projectId: string): Project {
      const project = this.projects.find(prj => prj.id === projectId);
      if (project) {
        return project as Project;
      }
      throw new Error(`No project found for ID "${projectId}.`);
    },
    /**
     * Resets the session.
     *
     * @returns {void}
     */
    reset(): void {
      this.account = null;
    }
  }
});
