import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * HTTP Request Audit Logger Middleware.
 * Listens to incoming HTTP request finish events and logs latency, IP, method, status code, and user identity.
 */
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP_AUDIT');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Attach finish event listener to calculate request duration
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const userId = (req as any).user?.id || 'ANONYMOUS';
      const tenantId = (req as any).user?.tenantId || (req.headers['x-tenant-id'] as string) || 'N/A';

      const logMessage = `METHOD=${method} ROUTE=${originalUrl} STATUS=${statusCode} LATENCY=${responseTime}ms IP=${ip} USER_ID=${userId} TENANT_ID=${tenantId} USER_AGENT="${userAgent}"`;

      // Log warning for 4xx/5xx status, info for 2xx status
      if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}