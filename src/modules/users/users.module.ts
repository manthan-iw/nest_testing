import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * Users Feature Module.
 * Binds UsersController and UsersService, exporting UsersService for AuthModule.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
