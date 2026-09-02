import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

/**
 * Authentication Feature Module.
 * Binds AuthController and AuthService, importing UsersModule for database user queries.
 */
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
