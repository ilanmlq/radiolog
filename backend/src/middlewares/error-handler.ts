import { NextFunction, Request, Response } from 'express';
import { logMessage } from '../utils/logger';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  // Vérifier si c'est une erreur opérationnelle (erreur métier)
  if (err instanceof AppError && err.isOperational) {
    // Erreur métier prévue (4XX) - log en warning
    logMessage('warn', 'errorHandler', err.message, {
      statusCode: err.statusCode,
      stack: err.stack
    });

    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Erreur non prévue (500) - log en error
  logMessage('error', 'errorHandler', 'Internal Server Error', {
    error: err.message,
    stack: err.stack
  });

  return res.status(500).json({
    message: 'Internal Server Error',
  });
};