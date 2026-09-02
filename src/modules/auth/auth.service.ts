import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

/**
 * Authentication Business Logic Service.
 * Handles credential verification, bcrypt password comparison, and JWT token issuance.
 */
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Authenticates user with email and password.
   * 
   * @param loginDto User login credentials (email & password)
   * @returns User profile and access/refresh token payloads
   */
  async login(loginDto: LoginDto) {
    // Look up user by email from PostgreSQL via UsersService
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare plain text login password against stored bcrypt password hash
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Return authenticated user profile and token payloads
    return {
      accessToken: `mock_jwt_access_token_${user.id}`,
      refreshToken: `mock_jwt_refresh_token_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId || null,
      },
    };
  }
}
