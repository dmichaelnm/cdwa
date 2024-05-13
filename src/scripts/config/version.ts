/**
 * Defines the possible environment types.
 */
type TEnvironment = 'local' | 'development' | 'test' | 'production';

/**
 * Defines the version structure type.
 */
type TVersion = {
  // Major Version Number
  major: string;
  // Minor Version Number
  minor: string;
  // Patch Version Number
  patch: string;
  // Environment Name
  environment: TEnvironment;
  // Build Date
  build: string;
}

/**
 * Contains information about the current version of the application.
 */
export const version: TVersion = {
  major: '0',
  minor: '1',
  patch: '0',
  environment: 'local',
  build: '1900-01-01 00:00:00'
};
