import { Request, Response, NextFunction } from 'express';
import { UsersController } from './users.controller';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo';
import { User } from '../entities/user';

jest.mock('../services/auth');

describe('Given CaresController class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let mockRepo: jest.Mocked<UsersMongoRepo>;

  beforeAll(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  beforeEach(() => {
    mockRepo = {
      getById: jest.fn().mockResolvedValue({}),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      login: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<UsersMongoRepo>;

    controller = new UsersController(mockRepo);
  });

  describe('When we instantiate it without errors', () => {
    test('Then login should return user data and token for a valid user', async () => {
      const mockRequestWithUserId = {
        body: { userId: 'someUserId' },
        params: {},
        query: { key: 'value' },
      } as unknown as Request;
      const mockResponseWithUserId = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      await controller.login(
        mockRequestWithUserId,
        mockResponseWithUserId,
        mockNext
      );
      expect(mockResponseWithUserId.json).toHaveBeenCalled();
    });

    test('Then login should successfully authenticate with valid credentials and return user data and token', async () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          passwd: 'test',
        },
      } as unknown as Request;

      const mockUser = {
        email: 'TestName',
        passwd: 'test',
      } as unknown as User;
      mockRepo.login.mockResolvedValueOnce(mockUser);
      await controller.login(mockRequest, mockResponse, mockNext);

      expect(mockRepo.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwd: 'test',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Invalid multer file');
      const mockRepo = {
        login: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
      } as unknown as UsersMongoRepo;

      controller = new UsersController(mockRepo);
    });
    test('Then login should throw an error', async () => {
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
    // test('Then register (create) should throw an error', async () => {
    //   await controller.create(mockRequest, mockResponse, mockNext);
    //   expect(mockNext).toHaveBeenCalledWith(mockError);
    // });
  });
});
