import { defineStore } from 'pinia';
import { Account } from 'src/scripts/firestore/account';

export const useSessionStore = defineStore('session', {
  state: () => ({
    // The authorized account
    account: null as Account | null
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
     * Resets the session.
     *
     * @returns {void}
     */
    reset(): void {
      this.account = null;
    }
  }
});
