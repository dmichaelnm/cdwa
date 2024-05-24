import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

import * as logger from 'firebase-functions/logger';

/**
 * Represents the configuration properties for a connection to a S3 Bucket.
 */
type TConnectionProperties = {
  // The region where the storage service is located.
  region: string;
  // The name of the bucket to connect to.
  bucket: string;
  // The access key ID for authenticating the connection.
  accessKeyId: string;
  // The secret access key for authenticating the connection.
  secretAccessKey: string;
};

/**
 * Contains static methods for connecting to an AWS S3 Bucket and processing data from it.
 */
export default class S3 {

  /**
   * Tests the connection to an S3 bucket using the provided connection properties.
   *
   * @param properties The connection properties for the S3 bucket.
   *
   * @returns {Promise<{ status: 'okay' | 'error', message: string }>} - A promise that resolves to an object containing
   *                                                                the connection status and an optional error message.
   */
  static async testConnection(
    properties: TConnectionProperties
  ): Promise<{ status: 'okay' | 'error', message: string }> {
    try {
      // Create S3 configuration
      const config = {
        region: properties.region,
        credentials: {
          accessKeyId: properties.accessKeyId,
          secretAccessKey: properties.secretAccessKey
        }
      };
      // Create S3 client
      const client = new S3Client(config);
      // Create command for listing objects
      const command = new ListObjectsCommand({
        Bucket: properties.bucket,
        MaxKeys: 10
      });
      // Execute the command
      const result = await client.send(command);
      // Return success response
      return { status: 'okay', message: `Bucket: ${result.Name}` };
    } catch (error: any) {
      logger.error(error);
      // Return error response
      const message = error.message ? error.message : JSON.stringify(error);
      return { status: 'error', message: message };
    }
  }
}
