import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { getPinoLoggerConfig } from './logger.config';
import { CustomLoggerService } from './logger.service';

/**
 * Encapsulated Custom Logger Module.
 * Configures nestjs-pino LoggerModule and exports CustomLoggerService globally.
 */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPinoLoggerConfig,
    }),
  ],
  providers: [CustomLoggerService],
  exports: [PinoLoggerModule, CustomLoggerService],
})
export class CustomLoggerModule {}
