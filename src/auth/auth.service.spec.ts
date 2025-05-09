import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

/**
 * Test suite for AuthService
 * Tests authentication-related functionality including:
 * - User login
 * - JWT token generation
 * - Password validation
 * - User registration
 */
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAuthRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  /**
   * Setup before each test
   * Creates fresh instances of services and mocks
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(Auth),
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  /**
   * Cleanup after each test
   * Resets all mock functions
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for login functionality
   * Tests various login scenarios and edge cases
   */
  describe('login', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      role: 'USER',
    };

    const mockLoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return JWT token when credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(mockLoginDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: 'different-password',
      });

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    const username = 'testuser';
    const password = 'password123';
    const hashedPassword = 'hashedPassword123';

    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username,
        password: hashedPassword,
      };

      mockAuthRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(username, password);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
      });
    });

    it('should return null when user is not found', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: 1,
        username,
        password: hashedPassword,
      };

      mockAuthRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser(username, password);
      expect(result).toBeNull();
    });
  });
});
