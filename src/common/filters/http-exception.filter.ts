import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP Exception Filter.
 * Catches all unhandled exceptions across the application, formats clean error JSON, and logs stack traces cleanly.
 */
@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status code (defaults to 500 Internal Server Error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract exception response object or error message
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || (exception as Error).message
        : (exception as Error).message || 'Internal Server Error';

    const formattedMessage = Array.isArray(message) ? message.join(', ') : message;

    // Format standardized JSON error response
    const errorDetails = {
      success: false,
      statusCode: status,
      path: request.url,
      method: request.method,
      message: formattedMessage,
      timestamp: new Date().toISOString(),
    };

    // Differentiate between 500 Internal Error (error + stack trace) and 4xx Client Warnings (warn)
    if (status >= 500) {
      this.logger.error(
        `API_ERROR [${request.method} ${request.url}] Status: ${status} Message: ${formattedMessage}`,
        (exception as Error).stack,
      );
    } else {
      this.logger.warn(
        `API_WARNING [${request.method} ${request.url}] Status: ${status} Message: ${formattedMessage}`,
      );
    }

    // Send formatted JSON error response to client
    response.status(status).json(errorDetails);
  }
}
