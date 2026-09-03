import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from '@prisma/client';

/** User profile type excluding sensitive password hash */
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

/**
 * Users Management Business Logic Service.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Sanitizes user object by removing passwordHash.
   */
  private sanitizeUser(user: User): UserWithoutPassword {
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Creates a new user record in PostgreSQL.
   * Hashes password with bcrypt and prevents duplicate email registration.
   */
  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    // 1. Check for duplicate email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email "${createUserDto.email}" already exists`,
      );
    }

    // 2. Hash password with bcrypt (salt factor 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // 3. Insert user into database
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
        role: createUserDto.role ? createUserDto.role : UserRole.USER,
      },
    });

    // 4. Return sanitized user
    return this.sanitizeUser(user);
  }
}
