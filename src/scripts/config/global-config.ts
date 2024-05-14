import { ELogLevel } from 'src/scripts/util/logging';

/**
 * Defines the type of the global configuration instance for the application.
 */
type TGlobalConfig = {
  // Application wide log level
  logLevel: ELogLevel
};

/**
 * The global configuration instance for the application.
 */
export const globalConfig: TGlobalConfig = {
  logLevel: ELogLevel.trace
};
