import { createLogger, format, transports } from 'winston';

const isProd = process.env.TARGET_ENV === 'production';
const level = isProd ? 'verbose' : 'debug';

const transport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.simple(),
    format.errors({ stack: true }),
  ),
});

const logger = createLogger({
  level,
  defaultMeta: { service: 'radio-log' },
  transports: [transport],
  exceptionHandlers: [transport],
  rejectionHandlers: [transport],
});

/**
 * Logs a message with an optional context.
 * In the Google Cloud Logs Explorer, find these messages with the
 * following query (adapt to suit your needs):
 * ```
 * jsonPayload.type="message"
 * ````
 *
 * @param level Log level (error, warn, info, http, verbose, debug, silly)
 * @param unit Name of the unit for logging
 * @param message Message to be logged
 * @param context Optional context to be logged (like a payload) -- avoid
 * sensitive data as it will be logged verbatim
 */

export function logMessage(
  level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly',
  unit: string,
  message: string,
  context?: string | Record<string, unknown>,
) {
  logger[level](message, {
    unit,
    type: 'message',
    context: context,
  });
}