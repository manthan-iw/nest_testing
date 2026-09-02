import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.ATTENDEE,
    tenantId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
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

  it('should return list of users on findAll()', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return single user on findOne(id)', async () => {
    const result = await controller.findOne(mockUser.id);
    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
  });

  it('should delegate to service.create() on create()', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
