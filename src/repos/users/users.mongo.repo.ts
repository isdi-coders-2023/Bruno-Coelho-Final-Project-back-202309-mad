import createDebug from 'debug';
import { Repository } from '../repo';
import { LoginUser, User } from '../../entities/user.js';
import { UserModel } from './users.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('BC:users:mongo:repo');

export class UsersMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    console.log('repo', newItem);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    // const result = await UserModel.findOne({ email: loginUser.email }).exec();
    const result = await UserModel.findOne({ email: loginUser.email })
      .populate('cares')
      .exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  search(_typeToSearch: string): Promise<User[]> {
    const result = UserModel.find({ type: _typeToSearch }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Search not possible');
    return result;
  }

  getByPage(_typeToSearch: string): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
