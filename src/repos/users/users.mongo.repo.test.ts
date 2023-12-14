import { UsersMongoRepo } from './users.mongo.repo';
import { UserModel } from './users.mongo.model.js';
import { Auth } from '../../services/auth.js';
import { LoginUser, User } from '../../entities/user';

jest.mock('./users.mongo.model.js');
jest.mock('../../services/auth.js');

describe('GivenUsersMongoRepo', () => {
  Auth.hash = jest.fn();
  Auth.compare = jest.fn().mockResolvedValue(true);
  let repo: UsersMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    beforeEach(() => {
      const mockQueryMethod = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
        exec,
      });
      UserModel.find = mockQueryMethod;
      UserModel.findById = mockQueryMethod;
      UserModel.findOne = mockQueryMethod;
      UserModel.findByIdAndUpdate = mockQueryMethod;
      UserModel.create = jest.fn().mockResolvedValue('Test');
      repo = new UsersMongoRepo();
    });

    test('Then it should execute create', async () => {
      const result = await repo.create({} as Omit<User, 'id'>);
      expect(Auth.hash).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute login', async () => {
      const result = await repo.login({} as LoginUser);
      expect(UserModel.findOne).toHaveBeenCalled();
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

    test('Then it should execute search', async () => {
      const result = await repo.search('hair');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await repo.update('1', { id: '2' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Given delete method is unimplemented', async () => {
      const deleteMethod = () => repo.delete('');
      expect(deleteMethod).toThrow('Method not implemented.');
    });

    test('Given getbyPage method is unimplemented', async () => {
      const getByPageMethod = () => repo.getByPage('');
      expect(getByPageMethod).toThrow('Method not implemented.');
    });
  });
  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(undefined);
    beforeEach(() => {
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.findOne = jest.fn().mockReturnValue({
        exec,
      });
      repo = new UsersMongoRepo();
    });
    test('Then getById should throw an error', async () => {
      // Cómo testear un error asíncrono
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then should execute login() throwing an error', async () => {
      expect(repo.login({} as User)).rejects.toThrow();
    });
  });
});
