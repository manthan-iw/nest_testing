import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global Prisma Database Module.
 * Marked as @Global() so PrismaService is accessible across all feature modules without extra imports.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
