import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Service extending PrismaClient.
 * Handles database connection lifecycle events ($connect and $disconnect).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Pass query logging configuration options to PrismaClient superclass constructor
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  /**
   * Lifecycle hook executed when NestJS module initializes.
   * Establishes active database connection pool to PostgreSQL.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Lifecycle hook executed when NestJS application shuts down.
   * Gracefully closes database connection pool.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
