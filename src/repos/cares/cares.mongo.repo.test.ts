import { CaresMongoRepo } from './cares.mongo.repo';
import { CareModel } from './cares.mongo.model.js';
import { Auth } from '../../services/auth.js';
import { Care } from '../../entities/care';

jest.mock('./cares.mongo.model.js');
jest.mock('../../services/auth.js');

describe('GivenCaresMongoRepo', () => {
  Auth.hash = jest.fn();
  Auth.compare = jest.fn().mockResolvedValue(true);
  let repo: CaresMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    beforeEach(() => {
      const mockQueryMethod = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
        exec,
      });
      CareModel.find = mockQueryMethod;
      CareModel.findById = mockQueryMethod;
      CareModel.findOne = mockQueryMethod;
      CareModel.findByIdAndUpdate = mockQueryMethod;
      CareModel.create = jest.fn().mockResolvedValue('Test');
      repo = new CaresMongoRepo();
    });

    test('Then it should execute search', async () => {
      const result = await repo.search('hair');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getByPage', async () => {
      const result = await repo.getByPage('', '');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      const result = await repo.create({} as Omit<Care, 'id'>);
      expect(Auth.hash).toHaveBeenCalled();
      expect(CareModel.create).toHaveBeenCalled();
      expect(result).toBe('Test');
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

    test('Then it should execute update', async () => {
      const result = await repo.update('1', { id: '2' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Given delete method is unimplemented', async () => {
      const deleteMethod = () => repo.delete('', '');
      expect(deleteMethod).toThrow('Method not implemented.');
    });
  });
  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(undefined);
    beforeEach(() => {
      CareModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      CareModel.findOne = jest.fn().mockReturnValue({
        exec,
      });
      repo = new CaresMongoRepo();
    });
    test('Then getById should throw an error', async () => {
      // Cómo testear un error asíncrono
      expect(repo.getById('')).rejects.toThrow();
    });
  });
});

// Test('Given update method is unimplemented', async () => {
//   const updateMethod = () => repo.update('', {});
//   expect(updateMethod).toThrow('Method not implemented.');
// });

// test('Given search method is unimplemented', async () => {
//   const searchMethod = () => repo.search({ key: 'id', value: '' });
//   expect(searchMethod).toThrow('Method not implemented.');
// });
