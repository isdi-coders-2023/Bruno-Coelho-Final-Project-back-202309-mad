import { NextFunction, Request, Response } from 'express';
import { AuthInterceptor } from './auth.interceptor';
import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo';
import { TokenPayload } from '../services/auth';
import { HttpError } from '../types/http.error';
import { Auth } from '../services/auth';

describe('Given the AuthInterceptor middleware', () => {
  describe('When it is instantiated', () => {
    const mockRepo = {} as unknown as CaresMongoRepo;
    const mockPayload = {} as TokenPayload;
    const req = {
      body: { tokenPayload: mockPayload },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const interceptor = new AuthInterceptor(mockRepo);

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

    test('Then the authorization method should throw an error when authHeader does not start with Bearer', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
      req.get = jest.fn().mockReturnValueOnce('No Bearer');
      (Auth.verifyAndGetPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.authorization(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated', () => {
    const mockCaresMongoRepo = {
      queryById: jest.fn().mockResolvedValue({ owner: { id: '6' } }),
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

    test('Then the authorization method should throw an error when there is no token in the body', () => {
      const error = new HttpError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
      const mockPayload = null;
      const req = {
        body: { tokenPayload: mockPayload },
      } as unknown as Request;

      authInterceptor.authorization(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the authorization method should throw an error when the film owner id does not match with the id from the request params', async () => {
      const error = new HttpError(401, 'Not authorized', 'Not authorized');
      const mockUserId = { id: '7' };
      const mockFilmId = { id: '3', owner: { id: '6' } };
      const req = {
        body: { tokenPayload: mockUserId },
        params: mockFilmId,
      } as unknown as Request;

      authInterceptor.authorization(req, res, next);
      await expect(mockCaresMongoRepo.getById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
