import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockCreatedUser = {
    id: 'user-uuid-123',
    name: 'Manthan',
    email: 'manthan@example.com',
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
    const mockUsersService = {
      create: jest.fn().mockResolvedValue(mockCreatedUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create user request to usersService.create() and return sanitized user', async () => {
    const result = await controller.create(createUserDto);

    expect(result).toEqual(mockCreatedUser);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });
});
