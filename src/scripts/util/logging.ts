// noinspection JSUnusedGlobalSymbols

import { globalConfig, ELogLevel } from 'src/scripts/config/global-config';

/**
 * The Logging class provides methods for logging data at different log levels.
 */
export class Logging {

  /**
   * Outputs log data at the trace level if the global configured log level is
   * 'trace'.
   *
   * @param {...any} data - The data to be logged.
   *
   * @return {void}
   */
  static trace(...data: any[]): void {
    Logging.log(ELogLevel.trace, ...data);
  }

  /**
   * Outputs log data at the debug level if the global configured log level is
   * 'debug' or lower.
   *
   * @param {...any} data - The data to be logged.
   *
   * @return {void}
   */
  static debug(...data: any[]): void {
    Logging.log(ELogLevel.debug, ...data);
  }

  /**
   * Outputs log data at the info level if the global configured log level is
   * 'info' or lower.
   *
   * @param {...any} data - The data to be logged.
   *
   * @return {void}
   */
  static info(...data: any[]): void {
    Logging.log(ELogLevel.info, ...data);
  }

  /**
   * Outputs log data at the warn level if the global configured log level is
   * 'warn' or lower.
   *
   * @param {...any} data - The data to be logged.
   *
   * @return {void}
   */
  static warn(...data: any[]): void {
    Logging.log(ELogLevel.warn, ...data);
  }

  /**
   * Outputs log data at the error level if the global configured log level is
   * 'error' or lower.
   *
   * @param {...any} data - The data to be logged.
   *
   * @return {void}
   */
  static error(...data: any[]): void {
    Logging.log(ELogLevel.error, ...data);
  }

  /**
   * Logs the given data with the specified log level, if the global configured
   * log level is less or equal than the specified log level.
   *
   * @param {ELogLevel} level - The log level to use.
   * @param {...any} data - The data to log.
   *
   * @returns {void}
   */
  static log(level: ELogLevel, ...data: any[]): void {
    if (level >= globalConfig.logLevel) {
      switch (level) {
        case ELogLevel.trace:
          console.trace(...data);
          break;
        case ELogLevel.debug:
          console.debug(...data);
          break;
        case ELogLevel.info:
          console.info(...data);
          break;
        case ELogLevel.warn:
          console.warn(...data);
          break;
        case ELogLevel.error:
          console.error(...data);
          break;
        default:
          throw new Error(`Unknonw log level: ${level}`);
      }
    }
  }
}
