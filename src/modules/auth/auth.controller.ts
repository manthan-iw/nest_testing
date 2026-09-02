import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * Authentication REST Controller.
 * Exposes authentication endpoints (/api/v1/auth).
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User Login Endpoint.
   * Accepts LoginDto and authenticates user against stored bcrypt password hashes.
   */
  @Post('login')
  @ApiOperation({ summary: 'User authentication login endpoint' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
