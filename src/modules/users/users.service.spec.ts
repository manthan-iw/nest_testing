import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    passwordHash: 'hashedPassword123',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.ATTENDEE,
    tenantId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
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

  describe('findAll', () => {
    it('should return an array of users excluding passwordHash', async () => {
      const { passwordHash, ...userWithoutPassword } = mockUser;
      prisma.user.findMany.mockResolvedValue([userWithoutPassword]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        select: expect.any(Object),
      });
      expect(result).toEqual([userWithoutPassword]);
    });
  });

  describe('findOne', () => {
    it('should return user details if user exists and is not deleted', async () => {
      const { passwordHash, ...userWithoutPassword } = mockUser;
      prisma.user.findFirst.mockResolvedValue(userWithoutPassword);

      const result = await service.findOne(mockUser.id);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: mockUser.id, deletedAt: null },
        select: expect.any(Object),
      });
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw NotFoundException if user is not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    const createUserDto = {
      email: 'newuser@example.com',
      password: 'SecurePassword123!',
      firstName: 'Jane',
      lastName: 'Doe',
      role: UserRole.ATTENDEE,
    };

    it('should throw ConflictException if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should hash password and create a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        ...mockUser,
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      });

      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'mockedHashedPassword');

      const result = await service.create(createUserDto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          passwordHash: 'mockedHashedPassword',
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: UserRole.ATTENDEE,
        },
      });
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toBe(createUserDto.email);
    });
  });
});
