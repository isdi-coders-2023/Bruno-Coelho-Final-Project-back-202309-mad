import { AuthInterceptor } from './auth.interceptor.js';
import { Request, Response, NextFunction } from 'express';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';

import { User } from '../entities/user.js';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';

jest.mock('../services/auth.js');

describe('Given AuthInterceptor class', () => {
  let authInterceptor: AuthInterceptor;

  beforeEach(() => {
    authInterceptor = new AuthInterceptor();
  });

  describe('When we use authorization method', () => {
    test('Then should set userId and tokenRole on the request body when Authorization header is valid', async () => {
      const req = {
        get: jest.fn(() => 'Bearer validToken'),
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const mockPayload = { id: 'userId123', role: 'user' };
      (Auth.verifyAndGetPayload as jest.Mock).mockReturnValue(mockPayload);

      authInterceptor.authorization(req, res, next);

      expect(Auth.verifyAndGetPayload).toHaveBeenCalledWith('validToken');
      expect(mockPayload).toStrictEqual({ id: 'userId123', role: 'user' });
      expect(next).toHaveBeenCalled();
    });
    test('Then should call next with an HttpError when Authorization header is missing or invalid', async () => {
      const req = {
        get: jest.fn().mockReturnValue(null),
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      authInterceptor.authorization(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    });
  });

  describe('When we use adminAuthentication method', () => {
    test('Then should call next when admin property is true', async () => {
      const req = { body: { adminUserID: '1' } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const mockUser = { id: '1', admin: true } as unknown as User;
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
      } as unknown as UsersMongoRepo;

      UsersMongoRepo.prototype.getById = mockRepo.getById;

      authInterceptor.adminAuthentication(req, res, next);
      await expect(mockRepo.getById).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then should throw HttpError with status 403 when user property is false', async () => {
      const mockError = new HttpError(401, 'Unauthorized', 'User not valid');
      const req = { body: { adminUserID: '1' } } as unknown as Request;
      const res = {} as unknown as Response;
      const next = jest.fn() as NextFunction;
      const mockUser = { id: '1', admin: false } as unknown as User;

      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
      } as unknown as UsersMongoRepo;

      UsersMongoRepo.prototype.getById = mockRepo.getById;

      authInterceptor.adminAuthentication(req, res, next);
      await expect(mockRepo.getById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
