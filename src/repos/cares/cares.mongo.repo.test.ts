import { CaresMongoRepo } from './cares.mongo.repo';
import { CareModel } from './cares.mongo.model.js';
import { Care } from '../../entities/care';
import { UsersMongoRepo } from '../users/users.mongo.repo';

jest.mock('./cares.mongo.model.js');

describe('Given CaresMongoRepo', () => {
  let repo: CaresMongoRepo;

  describe('When we isntantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');

    beforeEach(() => {
      CareModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      CareModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      CareModel.create = jest.fn().mockResolvedValue('Test');
      repo = new CaresMongoRepo();
    });

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      UsersMongoRepo.prototype.getById = jest
        .fn()
        .mockResolvedValue({ cares: [] });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await repo.create({ client: {} } as Omit<Care, 'id'>);
      expect(result).toBe('Test');
    });

    test('Then it should execute search', async () => {
      const result = await repo.search({ key: 'price', value: '' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
  });

  describe('When we isntantiate it WITH errors', () => {
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
      // Cómo testear un error asíncrono
      expect(repo.getById('')).rejects.toThrow();
    });
  });
});
