import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Main application bootstrap function.
 * Initializes NestJS server, attaches global pipes, interceptors, filters, loggers, and Swagger UI.
 */
async function bootstrap() {
  // Create NestJS app instance with log buffering enabled until Logger is attached
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use nestjs-pino Logger instance as global application logger
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Retrieve environment configuration variables via ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string>('app.corsOrigin', '*');

  // Set global route prefix (e.g. /api/v1)
  app.setGlobalPrefix(apiPrefix);

  // Enable Cross-Origin Resource Sharing (CORS) for frontend client requests
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Attach Global Validation Pipe (Strips unauthorized fields & transforms types)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw exception if unknown extra properties are sent
      transform: true,            // Automatically transform payload plain objects to DTO instances
    }),
  );

  // Attach Global Response Formatter Interceptor ({ success: true, statusCode, message, data, timestamp })
  app.useGlobalInterceptors(new TransformInterceptor());

  // Attach Global Exception Filter (Catches unhandled errors & formats JSON error responses)
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Configure OpenAPI / Swagger UI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Virtual Exhibition SaaS API')
    .setDescription(
      'Production-grade RESTful API documentation for the Virtual Exhibition SaaS Platform.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Start HTTP Server
  await app.listen(port);

  // Log server boot information
  logger.log(`🚀 Server running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger Documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

// Execute bootstrap lifecycle
bootstrap();
