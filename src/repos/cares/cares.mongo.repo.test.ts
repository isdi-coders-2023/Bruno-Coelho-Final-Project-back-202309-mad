import { Care } from '../../entities/care';
import { CareModel } from './cares.mongo.model'; // Monaga solo tiene este con js
import { CaresMongoRepo } from './cares.mongo.repo';
import { UsersMongoRepo } from '../users/users.mongo.repo';
import { UserModel } from '../users/users.mongo.model';
import { HttpError } from '../../types/http.error';

jest.mock('./cares.mongo.model.js');
jest.mock('../users/users.mongo.model.js');

describe('Given CaresMongoRepo', () => {
  const mockRepo = new CaresMongoRepo();
  let caresRepo: CaresMongoRepo;

  describe('When we isntantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
      CareModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      CareModel.create = jest.fn().mockResolvedValue('Test');
      caresRepo = new CaresMongoRepo();
    });

    test('Then it should execute update', async () => {
      CareModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      const result = await caresRepo.update('', { name: 'Hair' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getAll', async () => {
      CareModel.find = jest.fn().mockReturnValue({
        exec,
      });
      const result = await caresRepo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await caresRepo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      UsersMongoRepo.prototype.getById = jest
        .fn()
        .mockResolvedValue({ cares: [] });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await caresRepo.create({ adminUser: {} } as Omit<
        Care,
        'id'
      >);
      expect(result).toBe('Test');
    });

    test('Then the search method should be used', async () => {
      const mockCare = [{ type: 'Test', enum: 'hair' } as unknown as Care];
      const exec = jest.fn().mockResolvedValueOnce(mockCare);
      CareModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await mockRepo.search('hair');
      expect(CareModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockCare);
    });

    test('Then the search method should be used', async () => {
      const mockCare = [{ type: 'Test', enum: 'hair' } as unknown as Care];

      const exec = jest.fn().mockResolvedValueOnce(mockCare);
      CareModel.find = jest.fn().mockReturnValueOnce({
        skip: jest.fn().mockReturnValueOnce({
          limit: jest.fn().mockReturnValueOnce({
            exec,
          }),
        }),
      });
      const result = await mockRepo.getByPage('hair', '2');
      expect(CareModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockCare);
    });

    test('Then should delete the careItem and remove it from the author cares array', async () => {
      const id = 'testId';
      const userID = 'testUserID';
      const exec = jest.fn().mockResolvedValue({});
      CareModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });

      await caresRepo.delete(userID, id);

      expect(CareModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      CareModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      CareModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      CareModel.findByIdAndDelete = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      caresRepo = new CaresMongoRepo();
    });

    test('Then should throw an error if the careItem does not exist', async () => {
      const id = 'testId';
      const userID = 'testUserID';
      const error = new HttpError(404, 'Not Found', 'Delete not possible');
      CareModel.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await expect(caresRepo.delete(userID, id)).rejects.toThrow(error);
    });

    test('Then getById should throw an error', async () => {
      expect(caresRepo.getById('')).rejects.toThrow();
    });

    test('Then update should throw an error', async () => {
      expect(caresRepo.update('', { name: 'Bomber' })).rejects.toThrow();
    });
  });
});
