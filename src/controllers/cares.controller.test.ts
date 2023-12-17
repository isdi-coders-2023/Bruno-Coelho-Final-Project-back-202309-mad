import { Request, Response, NextFunction } from 'express';
import { CaresController } from './cares.controller';
import { CaresMongoRepo } from '../repos/cares/cares.mongo.repo';

describe('Given CaresController class', () => {
  let controller: CaresController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
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

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getByPage: jest.fn().mockResolvedValue([{}]),
        search: jest.fn().mockResolvedValue([{}]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(undefined),
      } as unknown as CaresMongoRepo;

      controller = new CaresController(mockRepo);
    });

    test('Then getAll should...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then search should...', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then create should create a new caringItem with valid input data and image file', async () => {
      const mockRequest = {
        file: {
          caringItemFrontImg: [
            {
              path: 'valid/path/to/frontImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
      } as unknown as Request;
      const mockRepo = {
        create: jest.fn(),
      } as unknown as CaresMongoRepo;

      const controller = new CaresController(mockRepo);
      const mockImageDataFront = { url: 'https://example.com/frontImage.jpg' };

      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageDataFront),
      };

      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalled();
    });

    test('Then update should...', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then delete should...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.statusMessage).toBe('No Content');
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;

    beforeEach(() => {
      mockError = new Error('Mock error');
      const mockRepo = {
        getAll: jest.fn().mockRejectedValue(mockError),
        getByPage: jest.fn().mockRejectedValue(mockError),
        search: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(new Error('Invalid multer file')),
        update: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn().mockRejectedValue(mockError),
      } as unknown as CaresMongoRepo;

      controller = new CaresController(mockRepo);
    });
    test('Then getAll should throw an error', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then search should throw an error', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then create should throw an error', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Invalid multer file'));
    });

    test('Then update should throw an error', async () => {
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then delete should thrown an error', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
