import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from '@prisma/client';

/** User profile type excluding sensitive password hash */
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

/**
 * Users Management Business Logic Service.
 * Queries PostgreSQL via PrismaService to perform User CRUD operations.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all non-deleted platform users.
   * Excludes passwordHash from returned fields.
   */
  async findAll(): Promise<UserWithoutPassword[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  /**
   * Finds a specific user by ID.
   * Throws NotFoundException if user does not exist or is soft-deleted.
   */
  async findOne(id: string): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  /**
   * Finds user by email address (used during login authentication).
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  /**
   * Creates a new user record in PostgreSQL.
   * Hashes password using bcrypt (10 rounds) and prevents duplicate email registration.
   */
  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException(`User with email "${createUserDto.email}" already exists`);
    }

    // Hash password with bcrypt (salt factor 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // Insert user into PostgreSQL table
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: createUserDto.role ? (createUserDto.role as UserRole) : UserRole.ATTENDEE,
      },
    });

    // Omit passwordHash from return object
    const { passwordHash: _, ...result } = user;
    return result;
  }
}
