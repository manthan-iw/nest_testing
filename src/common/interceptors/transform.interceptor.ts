import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Standard API Response Wrapper Interface.
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Global Response Transformation Interceptor.
 * Intercepts all successful controller responses and formats them into uniform JSON structure.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    // Map raw controller output to standard JSON envelope
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message: data?.message || 'Operation executed successfully',
        data: data?.data !== undefined ? data.data : data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
