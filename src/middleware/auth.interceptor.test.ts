import { NextFunction, Request, Response } from 'express';
import { AuthInterceptor } from './auth.interceptor';
import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo';
import { TokenPayload } from '../services/auth';
import { HttpError } from '../types/http.error';
import { Auth } from '../services/auth';

jest.mock('../services/auth');
jest.mock('../repos/cares/cares.mongo.repo');

describe('Given the AuthInterceptor middleware', () => {
  describe('When it is instantiated', () => {
    const mockPayload = {} as TokenPayload;
    const req = {
      body: { tokenPayload: mockPayload },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const interceptor = new AuthInterceptor();

    test('Then the authorization method should be used', () => {
      req.get = jest.fn().mockReturnValueOnce('Bearer test');
      (Auth.verifyAndGetPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.authorization(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then the authorization method should throw an error when there is no authHeader', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Authorization header'
      );
      (Auth.verifyAndGetPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.authorization(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated', () => {
    const mockCaresMongoRepo = {
      getById: jest.fn().mockResolvedValue({ owner: { id: '6' } }),
    } as unknown as CaresMongoRepo;
    const mockPayload = { id: '6' } as TokenPayload;
    const mockFilmId = '2';
    const req = {
      body: { tokenPayload: mockPayload },
      params: { id: mockFilmId },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const authInterceptor = new AuthInterceptor();

    test('Then the authorization method should be used', async () => {
      authInterceptor.authorization(req, res, next);
      await expect(mockCaresMongoRepo.getById).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then the authorization method should throw an error ', async () => {
      const error = new HttpError(401, 'Not authorized', 'Not authorized');
      const mockUserId = { id: '7' };
      const mockFilmId = { id: '3', owner: { id: '6' } };
      const req = {
        body: { tokenPayload: mockUserId },
        params: mockFilmId,
      } as unknown as Request;

      authInterceptor.authorization(req, res, next);
      await expect(mockCaresMongoRepo.getById).toHaveBeenCalled(); // Corrige aquí
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
