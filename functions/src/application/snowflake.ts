import * as sf from 'snowflake-sdk';
import * as crypto from 'crypto-js';
import * as logger from 'firebase-functions/logger';

import { IConnection } from 'snowflake-sdk';

/**
 * Represents the connection properties for establishing a Snowflake connection.
 */
type TConnectionProperties = {
  // The Snowflake account name.
  account: string;
  // The username for authentication.
  username: string;
  // The password for authentication.
  password: string;
  // The name of the database to connect to.
  database: string;
  // The name of the warehouse to use for the connection.
  warehouse: string;
  // The name of the role to assume for the connection.
  role: string;
};

/**
 * Represents a statement object with SQL text, bind parameters, and a statement count.
 */
type TStatement = {
  // The SQL text of the statement.
  sqlText: string;
  // An array of bind parameters for the statement.
  binds: any[];
  // The number of single statements in the SQL text.
  count: number;
}

/**
 * Contains static methods for connecting to a Snowflake Database and executing statements.
 */
export default class Snowflake {

  /**
   * Represents a connection pool that stores connections of type IConnection.
   */
  private static connectionPool = new Map<string, IConnection>();

  /**
   * Creates a Snowflake connection using the provided connection properties.
   *
   * @param {TConnectionProperties} properties - The connection properties.
   *
   * @returns {Promise<IConnection>} - The promise that resolves to the created connection.
   */
  private static async createConnection(
    properties: TConnectionProperties
  ): Promise<IConnection> {
    // Create the promise
    return new Promise((resolve, reject) => {
      // Create Snowflake connection
      const connection = sf.createConnection({
        account: properties.account,
        username: properties.username,
        password: properties.password,
        database: properties.database,
        warehouse: properties.warehouse,
        role: properties.role,
        application: 'CDWA'
      });
      // Connect to the server
      connection.connect((error, conn) => {
        if (error) {
          // Failed to create a connection
          logger.error("Failed to create connection", error);
          // Reject promise with an error
          reject(error);
        } else {
          // Resolve promise with the connection
          resolve(conn as IConnection);
        }
      });
    });
  }

  /**
   * Checks the status of a connection by executing a test statement.
   * If the connection is no longer valid, it creates a new connection and replaces it in the connection pool.
   *
   * @param {TConnectionProperties} properties - The properties for creating a new connection.
   * @param {IConnection} connection - The connection object to check.
   *
   * @returns {Promise<IConnection>} - A promise that resolves with the valid connection object, or rejects with an error if creating a new connection fails.
   */
  private static async checkConnection(
    properties: TConnectionProperties,
    connection: IConnection
  ): Promise<IConnection> {
    return new Promise((resolve, reject) => {
      // Execute a little test statement to check the connections state
      connection.execute({
        sqlText: 'SELECT current_user()',
        binds: [],
        async complete(error: any) {
          if (error) {
            // Connection is no longer valid
            const key = crypto.SHA512(JSON.stringify(properties)).toString();
            // Remove old connection from pool
            Snowflake.connectionPool.delete(key);
            try {
              // Create a new connection and put it into the pool
              const newConn = await Snowflake.createConnection(properties);
              Snowflake.connectionPool.set(key, newConn);
              // Resolve with the new connection
              resolve(newConn);
            } catch (error) {
              // Creating connection has failed
              reject(error);
            }
          } else {
            // Connection is valid
            resolve(connection);
          }
        }
      });
    });
  }

  /**
   * Gets a database connection.
   *
   * @param {TConnectionProperties} properties - The properties needed to establish a connection.
   *
   * @returns {Promise<IConnection>} - A promise that resolves to a database connection.
   */
  private static async getConnection(
    properties: TConnectionProperties
  ): Promise<IConnection> {
    // Create the key for the connection
    const key = crypto.SHA512(JSON.stringify(properties)).toString();
    // Look into the connection pool
    if (Snowflake.connectionPool.has(key)) {
      // Take connection from pool
      const connection = Snowflake.connectionPool.get(key);
      // Check the connection and return it
      return await Snowflake.checkConnection(properties, connection as IConnection);
    } else {
      // No connection found, create a new one and put it into the pool
      const connection = await Snowflake.createConnection(properties);
      Snowflake.connectionPool.set(key, connection);
      return connection;
    }
  }

  /**
   * Executes the given SQL statement with the specified connection.
   *
   * @param {TStatement} statement - The SQL statement to execute.
   * @param {IConnection} connection - The connection to use for executing the statement.
   *
   * @returns {Promise<any[]>} - A promise that resolves with an array of rows returned by the statement execution.
   */
  private static async executeStatement(
    statement: TStatement,
    connection: IConnection
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Execute the statement with the specified connection
      connection.execute({
        sqlText: statement.sqlText,
        binds: statement.binds,
        parameters: { MULTI_STATEMENT_COUNT: statement.count },
        complete(error: any, statement?: any, rows?: any[]) {
          if (error) {
            // An error occurred
            reject(error);
          } else {
            // Execution was successful
            resolve(rows as any[]);
          }
        }
      });
    });
  }

  /**
   * Executes a batch of statements using the provided connection properties.
   *
   * @param {TConnectionProperties} properties - The connection properties.
   * @param {TStatement[]} statements - The statements to execute.
   *
   * @return {Promise<any[]>} - A promise that resolves to an array containing the result of each executed statement.
   */
  static async execute(
    properties: TConnectionProperties,
    statements: TStatement[]
  ): Promise<any[]> {
    // Get an active connection
    const connection = await Snowflake.getConnection(properties);
    // Create result array
    const result: any[][] = [];
    // Iterate over all statements and execute each statement
    for (let i = 0; i < statements.length; i++) {
      // Execute statement
      const rows = await Snowflake.executeStatement(statements[i], connection);
      // Add rows to result array
      result.push(rows);
    }
    // Return the result array
    return result;
  }

  /**
   * Tests the connection to a Snowflake database using the provided connection properties.
   *
   * @param {TConnectionProperties} properties - The connection properties to use for testing the connection.
   *
   * @returns {Promise<{ status: 'okay' | 'error', message: string }>} - A Promise that resolves to an object containing the connection test status and message.
   */
  static async testConnection(
    properties: TConnectionProperties
  ): Promise<{ status: 'okay' | 'error', message: string }> {
    try {
      // Create test statement
      const statement: TStatement = {
        sqlText: "select 'Snowflake (Version ' || current_version() || ', ' || current_region() || ')<br>Database: ' " +
          "|| coalesce(current_database(), 'N/A') ||  '<br>Warehouse: ' || coalesce(current_warehouse(), 'N/A') || " +
          "'<br>Role: ' || coalesce(current_role(), 'N/A') as info",
        binds: [],
        count: 1
      };
      // Get connection
      const connection = await Snowflake.getConnection(properties);
      // Execute the statement
      const result = await Snowflake.executeStatement(statement, connection);
      logger.debug(result);
      // Return result as status message
      return { status: 'okay', message: result[0]['INFO'] };
    } catch (error: any) {
      // Return error response
      const message = error.message ? error.message : JSON.stringify(error);
      // Return error as status
      return { status: 'error', message: message };
    }
  }
}
