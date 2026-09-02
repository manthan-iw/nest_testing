import { Injectable, LoggerService } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

/**
 * Custom Logger Service wrapper.
 * Implements NestJS LoggerService interface to provide unified Pino logging methods and custom user action logging.
 */
@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(private readonly pinoLogger: PinoLogger) {}

  /** Log standard info message */
  log(message: any, context?: string) {
    this.pinoLogger.info({ context }, message);
  }

  /** Log error exception message with stack trace */
  error(message: any, trace?: string, context?: string) {
    this.pinoLogger.error({ context, trace }, message);
  }

  /** Log warning message */
  warn(message: any, context?: string) {
    this.pinoLogger.warn({ context }, message);
  }

  /** Log debug level message */
  debug(message: any, context?: string) {
    this.pinoLogger.debug({ context }, message);
  }

  /** Log verbose level message */
  verbose(message: any, context?: string) {
    this.pinoLogger.trace({ context }, message);
  }

  /**
   * Helper method to log specific user audit events into JSON log output.
   * 
   * @param userId Authenticated User ID
   * @param route Target HTTP Route Path
   * @param message Event description
   */
  logUserAction(userId: string | number, route: string, message: string) {
    this.pinoLogger.info(
      {
        userId,
        route,
      },
      message,
    );
  }
}
