declare module 'snowflake-sdk' {

  /**
   * Represents a connection to a server.
   */
  export interface IConnection {

    /**
     * Establishes a connection to a server.
     *
     * @param {function} handler - The callback function to execute after the connection is established.
     *                            It takes two parameters: error and connection.
     *                            - The error parameter is used to handle any errors that occur during the connection process.
     *                              It can be undefined if no error occurs.
     *                            - The connection parameter is the established connection object.
     *                              It can be undefined if an error occurs.
     *
     * @return {void}
     */
    connect(
      handler: (error: any | undefined, connection?: IConnection | undefined) => void
    ): void;

    /**
     * Executes a SQL statement with bind variables.
     *
     * @param {Object} stmt - The statement object containing the SQL text, bind variables, and optional parameters.
     * @param {string} stmt.sqlText - The SQL statement to execute.
     * @param {Array} stmt.binds - The bind variables used in the SQL statement.
     * @param {any} [stmt.parameters] - Optional parameters.
     * @param {function} stmt.complete - The callback function to be called upon completion of execution.
     * @param {any} stmt.complete.error - The error object, if an error occurred during execution.
     * @param {any} [stmt.complete.statement] - The executed statement object.
     * @param {any[]} [stmt.complete.rows] - The returned rows, if any.
     *
     * @return {void}
     */
    execute(stmt: {
      sqlText: string,
      binds: any[],
      parameters?: any,
      complete(error: any, statement?: any, rows?: any[]): void
    }): void;
  }

  /**
   * Creates a connection to a database.
   *
   * @param {object} options - The options for the connection.
   * @param {string} options.account - The account name for the connection.
   * @param {string} options.username - The username for the connection.
   * @param {string} options.password - The password for the connection.
   * @param {string|null} options.database - The database name (nullable).
   * @param {string|null} options.warehouse - The warehouse name (nullable).
   * @param {string|null} options.role - The role name (nullable).
   * @param {string|null} options.application - The application name (nullable).
   *
   * @returns {object} - The connection object.
   */
  export function createConnection(
    options: {
      account: string,
      username: string,
      password: string,
      database: string | null,
      warehouse: string | null,
      role: string | null,
      application: string | null
    }
  ): IConnection;
}
