import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError, QueryFailedError } from 'typeorm';

/**
 * Custom filter to handle TypeORM database exceptions
 */
@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = null;

    // Check if it's a TypeORM error
    const isTypeORMError = exception instanceof TypeORMError;
    const isQueryFailedError = exception instanceof QueryFailedError;

    if (isTypeORMError || isQueryFailedError) {
      this.logger.error(
        `Database error: ${exception.message}`,
        exception.stack,
      );

      if (isQueryFailedError) {
        const queryError = exception as QueryFailedError;

        // SQLite specific error handling
        if (queryError.message.includes('SQLITE_CONSTRAINT')) {
          status = HttpStatus.CONFLICT;
          message = 'Database constraint violation';
        } else if (queryError.message.includes('SQLITE_NOTFOUND')) {
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
        } else {
          status = HttpStatus.BAD_REQUEST;
          message = 'Database query failed';
        }
      } else {
        // Generic TypeORM error
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Database error';
      }

      details = exception.message;
    } else {
      // Non-database error handling
      this.logger.error('Application error:', exception);

      // Check if the error has a status code
      if (exception.status) {
        status = exception.status;
      }

      // Check if the error has a message
      if (exception.message) {
        message = exception.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
