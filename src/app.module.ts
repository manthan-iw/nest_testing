import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

import { CustomLoggerModule } from './common/logger/logger.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

/**
 * Root Application Module.
 * Imports and orchestrates global configurations, logging, database connection, and domain modules.
 */
@Module({
  imports: [
    // Global Environment Configuration Module (loads app.config.ts & database.config.ts)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),

    // Global High-Performance Structured Pino Logger Module
    CustomLoggerModule,

    // Global PostgreSQL Prisma Database ORM Module
    PrismaModule,

    // Feature Domain Modules
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}

