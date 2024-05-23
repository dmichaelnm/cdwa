import { onRequest, Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { encryption } from './secret';

import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import * as crypto from 'crypto-js';

admin.initializeApp();

/**
 * Checks if the user is authorized by verifying the authorization token in the request header.
 *
 * @param {Request} request - The HTTP request object.
 * @param {Response} response - The HTTP response object.
 * @param {function(user: admin.auth.DecodedIdToken): Promise<void>} handler - The handler function to be called if the user is authorized.
 *
 * @return {Promise<void>} - A Promise that resolves when the authorization process is completed.
 */
async function isAuthorized(
  request: Request,
  response: Response,
  handler: (user: admin.auth.DecodedIdToken) => Promise<void>
): Promise<void> {
  // Get authorization header
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract token
    const token = authHeader.substring(7);
    try {
      // Verify the token
      const user = await admin.auth().verifyIdToken(token);
      try {
        // Call the handler function
        await handler(user);
      } catch (error) {
        // Log the error
        logger.error('Unexpected error in handler function', error);
        // Unexpected error in the handler function
        response.sendStatus(500);
      }
    } catch (error) {
      logger.error('Token verification failed.', error);
      // Token verification failed
      response.sendStatus(403);
    }
  } else {
    logger.error('Missing authorization header.');
    // Missing authorization header
    response.sendStatus(403);
  }
}

/**
 * Encrypts the string array from the request body using a specified algorithm and key.
 */
exports.encrypt = onRequest(
  { region: 'europe-west3', cors: true },
  async (request, response) => {
    await isAuthorized(request, response, async () => {
      // Get the client provided salt
      const salt = request.body.salt as string;
      // Get the array of plain value to be encrypted
      const plainValues = request.body.plain as string[];
      // Create the key
      const key = encryption.prefix + salt + encryption.suffix;
      // Hash the key
      const hashedKey = crypto.SHA512(key).toString(crypto.enc.Base64);
      // Create the array of encrypted string
      const encryptedValues: string[] = [];
      // Iterate over all plain values and encrypt them
      plainValues.forEach(plainValue => {
        // Encrypt the plain value
        const encryptedValue = crypto.AES.encrypt(plainValue, hashedKey).toString();
        // Add the encrypted value to the result array
        encryptedValues.push(encryptedValue);
      });
      // Set response
      response.json(encryptedValues);
    });
  });

/**
 * Decrypts the string array from the request body using a specified algorithm and key.
 */
exports.decrypt = onRequest(
  { region: 'europe-west3', cors: true },
  async (request, response) => {
    await isAuthorized(request, response, async () => {
      // Get the client provided salt
      const salt = request.body.salt as string;
      // Get the array of plain value to be encrypted
      const encryptedValues = request.body.encrypted as string[];
      // Create the key
      const key = encryption.prefix + salt + encryption.suffix;
      // Hash the key
      const hashedKey = crypto.SHA512(key).toString(crypto.enc.Base64);
      // Create the array of encrypted string
      const plainValues: string[] = [];
      // Iterate over all plain values and encrypt them
      encryptedValues.forEach(encryptedValue => {
        // Encrypt the plain value
        const plainValue = crypto.AES.decrypt(encryptedValue, hashedKey).toString(crypto.enc.Utf8);
        // Add the encrypted value to the result array
        plainValues.push(plainValue);
      });
      // Set response
      response.json(plainValues);
    });
  });

/**
 * Deletes a project from the system.
 *
 * @param {number} projectId - The ID of the project to be deleted.
 *
 * @returns {boolean} - A boolean representing whether the project was successfully deleted.
 */
exports.deleteProject = onRequest(
  { region: 'europe-west3', cors: true },
  async (request, response) => {
    await isAuthorized(request, response, async (user) => {
      // Get project ID
      const projectId = request.body.id as string;
      // Create document reference
      const documentRef = admin.firestore().doc('project/' + projectId);
      // Load project document
      const snapshot = await admin.firestore().getAll(documentRef);
      if (snapshot.length > 0) {
        const data = snapshot.at(0)?.data();
        if (data) {
          // Get members array
          const members = data.members as { accountId: string, role: string }[];
          // Check if the caller is the owner of the project
          const owner = members.find(
            mbr => mbr.accountId === user.uid && mbr.role === 'owner'
          );
          if (owner) {
            // User is permitted to delete the project
            await admin.firestore().recursiveDelete(documentRef);
            response.sendStatus(200);
          } else {
            // User tries to delete a project with no permission
            logger.error(`User "${user.uid}" tried to delete project "${projectId}".`);
            response.sendStatus(403);
          }
          return;
        }
      }
      // Failed to find project
      logger.error(`Failed to find or load project "${projectId}".`);
      response.sendStatus(404);
    });
  }
);
