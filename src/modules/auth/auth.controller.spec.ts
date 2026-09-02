import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockLoginResult = {
    accessToken: 'mock_jwt_access_token_123',
    refreshToken: 'mock_jwt_refresh_token_123',
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'auth.test@example.com',
      firstName: 'Alice',
      lastName: 'Smith',
      role: 'ATTENDEE',
      tenantId: null,
    },
  };

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn().mockResolvedValue(mockLoginResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate loginDto to authService.login()', async () => {
    const loginDto = {
      email: 'auth.test@example.com',
      password: 'CorrectPassword123!',
    };

    const result = await controller.login(loginDto);

    expect(result).toEqual(mockLoginResult);
    expect(service.login).toHaveBeenCalledWith(loginDto);
  });
});
