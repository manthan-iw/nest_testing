import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import * as path from 'path';

/**
 * Pino Logger Configuration Factory.
 * Configures transports for colorized development console logging and structured JSON file outputs.
 * 
 * @param configService NestJS ConfigService instance
 * @returns nestjs-pino configuration params
 */
export const getPinoLoggerConfig = (configService: ConfigService): Params => {
  const isDev = configService.get<string>('app.env') !== 'production';
  const logDir = path.join(process.cwd(), 'logs');

  return {
    pinoHttp: {
      // Set log level threshold (debug for development, info for production)
      level: isDev ? 'debug' : 'info',
      // Format timestamps as ISO strings ("time":"2026-08-06T10:41:00Z") for machine filtering
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      // Custom HTTP request & response serializers stripping unnecessary header bloat
      serializers: {
        req: (req) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          userId: req.raw?.user?.id || 'ANONYMOUS',
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
      // Concise single-line HTTP success message format
      customSuccessMessage: (req, res, responseTime) => {
        return `Request completed: ${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
      },
      // Concise single-line HTTP error message format
      customErrorMessage: (req, res, error) => {
        return `Request failed: ${req.method} ${req.url} ${res.statusCode} - ${error.message}`;
      },
      // Define Pino transport targets for console and physical log files
      transport: {
        targets: [
          // 1. Colorized single-line console output for local development terminal
          {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
              ignore: 'req,res,pid,hostname',
            },
          },
          // 2. Structured JSON file transport saving all app logs to logs/app.log
          {
            target: 'pino/file',
            options: {
              destination: path.join(logDir, 'app.log'),
              mkdir: true,
            },
          },
          // 3. Structured JSON error transport saving warn & error logs to logs/error.log
          {
            level: 'warn',
            target: 'pino/file',
            options: {
              destination: path.join(logDir, 'error.log'),
              mkdir: true,
            },
          },
        ],
      },
      // Tag all HTTP request logs with context property
      customProps: () => ({
        context: 'HTTP',
      }),
    },
  };
};
