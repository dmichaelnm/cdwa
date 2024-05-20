import * as tp from 'src/scripts/util/types';

/**
 * The global configuration instance for the application.
 */
export const globalConfig: tp.TGlobalConfig = {
  logLevel: tp.ELogLevel.trace,
  cloudFunctionsURL: 'http://127.0.0.1:5001/cdwa-development/europe-west3/:function:'
};
