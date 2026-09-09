import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  const mockUser = {
    id: 'user-uuid-123',
    name: 'Manthan',
    email: 'manthan@example.com',
    passwordHash: '$2b$10$hashedPasswordString',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const createUserDto = {
    name: 'Manthan',
    email: 'manthan@example.com',
    password: 'Password@123',
    role: UserRole.USER,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // 1. Happy Path (#1 & #9)
    it('should successfully create a new user with hashed password and return sanitized object', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => '$2b$10$mockHashedPassword');

      const result = await service.create(createUserDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: '$2b$10$mockHashedPassword',
          role: UserRole.USER,
        },
      });
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.id).toBe(mockUser.id);
      expect(result.name).toBe(createUserDto.name)
      expect(result.email).toBe("email");
    });

    // 2. Conflict (#4)
    it('should throw ConflictException when email already exists and abort creation', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    // 3. Database Error (#8)
    it('should propagate database connection errors', async () => {
      prisma.user.findUnique.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    // 4. Default Role Assignment (#9)
    it('should assign USER role by default when role is omitted in DTO', async () => {
      const dtoWithoutRole = {
        name: 'Manthan',
        email: 'manthan@example.com',
        password: 'Password@123',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => '$2b$10$mockHashedPassword');

      await service.create(dtoWithoutRole);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: dtoWithoutRole.name,
          email: dtoWithoutRole.email,
          passwordHash: '$2b$10$mockHashedPassword',
          role: UserRole.USER,
        },
      });
    });

    // 5. Sanitization Edge Case (#9)
    it('should never expose passwordHash in any returned fields', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => '$2b$10$mockHashedPassword');

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        deletedAt: null,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
