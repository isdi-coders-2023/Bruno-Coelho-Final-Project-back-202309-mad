import { Care } from '../../entities/care.js';
import { CareModel } from './cares.mongo.model.js'; // Monaga solo tiene este con js
import { CaresMongoRepo } from './cares.mongo.repo.js';
import { UsersMongoRepo } from '../users/users.mongo.repo';
import { UserModel } from '../users/users.mongo.model';
import { HttpError } from '../../types/http.error.js';

jest.mock('./cares.mongo.model.js');
jest.mock('../users/users.mongo.repo.js');

describe('GivenCaresMongoRepo', () => {
  const mockRepo = new CaresMongoRepo();
  let repo: CaresMongoRepo;
  describe('When it is instantiated', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    // Search
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
    // Page
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
    // Get All
    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
    // Get By Id
    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
    // Create
    test('Then it should execute create', async () => {
      UsersMongoRepo.prototype.getById = jest.fn().mockResolvedValue({
        cares: [],
      });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await repo.create({ adminUserID: {} } as Omit<Care, 'id'>);
      expect(result).toBe('Test');
    });
    // Update
    test('Then it should execute update', async () => {
      UsersMongoRepo.prototype.getById = jest.fn().mockResolvedValue({
        cares: [],
      });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await repo.update('1', { name: 'Hair' });
      expect(result).toBe('Test');
    });
    // Delete
    test('Then it should execute delete', async () => {
      UsersMongoRepo.prototype.getById = jest.fn().mockResolvedValue({
        cares: [],
      });
      UsersMongoRepo.prototype.delete = jest.fn();
      const result = await repo.delete('1', '2');
      expect(result).toBe('1');
    });
  });
  describe('When we instantiate it WITH errors', () => {
    const exec = jest.fn().mockRejectedValue(new Error('Test'));
    beforeEach(() => {
      CareModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      repo = new CaresMongoRepo();
    });

    test('Then it should execute getById', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });
  });

  describe('delete', () => {
    test('should delete the care and remove it from the care adminUserID array', async () => {
      const id = 'testId';
      const userID = 'userID';
      const careId = 'careId';

      (CareModel.findById as jest.Mock).mockResolvedValueOnce({
        adminUserID: careId,
      });
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({});
      (CareModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({});

      await repo.delete(userID, id);

      expect(CareModel.findById).toHaveBeenCalledWith(id);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(careId, {
        $pull: { Cares: id },
      });
      expect(CareModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    test('should throw an error if the care does not exist', async () => {
      const id = 'testId';

      (CareModel.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(repo.delete('test', id)).rejects.toThrow(
        new HttpError(404, 'Not Found', 'Delete not possible')
      );

      expect(CareModel.findById).toHaveBeenCalledWith(id);
      expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(CareModel.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
