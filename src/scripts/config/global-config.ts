/**
 * Defines the type of the global configuration instance for the application.
 */
export type TGlobalConfig = {
  // Application wide log level
  logLevel: ELogLevel
};

/**
 * Enumeration representing the different levels of log messages.
 */
export enum ELogLevel {
  // Trace message
  trace = 0,
  // Debug message
  debug = 1,
  // Information message
  info = 2,
  // Warning message
  warn = 3,
  // Error message
  error = 4
}

/**
 * The global configuration instance for the application.
 */
export const globalConfig: TGlobalConfig = {
  logLevel: ELogLevel.trace
};
