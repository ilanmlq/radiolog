import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { logMessage } from '../utils/logger';

/**
 * A middleware to validate the request body or query params against a Zod schema
 * @param {ZodTypeAny} schema The Zod schema to validate against
 * @param {'body' | 'params' | 'query'} source The source to validate against, either 'body', 'params' or 'query'
 * @return {Promise<void>} A middleware function
 */
const validate =
  <T>(
    schema: ZodType<T>,
    source: 'body' | 'params' | 'query',
  ): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      // @ts-ignore source is guaranteed to be 'body', 'params', or 'query' from the function signature
      const propName = `parsed${source[0].toUpperCase()}${source.slice(1)}`;
      // @ts-ignore the property name is built from known values (see source type)
      req[propName] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logMessage('debug', 'schemaValidator', 'request failed validation', {
          issues: err.issues,
        });
        res
          .status(400)
          .setHeader('Content-Type', 'application/json')
          .json({ issues: err.issues });
      } else {
        next(err);
      }
    }
  };

export const validateBody = <T>(schema: ZodType<T>) => validate(schema, 'body');
export const validateParams = <T>(schema: ZodType<T>) =>
  validate(schema, 'params');
export const validateQuery = <T>(schema: ZodType<T>) =>
  validate(schema, 'query');

// Add parsedQuery, parsedParams, and parsedBody to the Request interface so
// that it's globally available whenever accessing req.parsedQuery, etc.
declare module 'express' {
  interface Request {
    parsedQuery?: unknown;
    parsedParams?: unknown;
    parsedBody?: unknown;
  }
}
