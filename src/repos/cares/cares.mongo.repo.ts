import { Care } from '../../entities/care.js';
import { CareModel } from './cares.mongo.model.js';
import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../users/users.mongo.repo.js';
import mongoose from 'mongoose';

const debug = createDebug('BC:Cares:mongo:repo');

export class CaresMongoRepo implements Repository<Care> {
  usersRepo: UsersMongoRepo;
  constructor() {
    this.usersRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async search(typeToSearch: string): Promise<Care[]> {
    const result = await CareModel.find({ type: typeToSearch }).exec();
    return result;
  }

  async getByPage(typeToSearch: string, page: string): Promise<Care[]> {
    const result = await CareModel.find({ type: typeToSearch })
      .skip((Number(page) - 1) * 5)
      .limit(5)
      .exec();
    return result;
  }

  async getAll(): Promise<Care[]> {
    const result = await CareModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<Care> {
    const result = await CareModel.findById(id)
      .populate('client', {
        cares: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async create(newItem: Omit<Care, 'id'>): Promise<Care> {
    const userID = newItem.adminUserID;
    const user = await this.usersRepo.getById(userID);
    const result: Care = await CareModel.create({ ...newItem, client: userID });
    user.cares.push(result);
    await this.usersRepo.update(userID, user);
    return result;
  }

  async update(id: string, updatedItem: Partial<Care>): Promise<Care> {
    const result = await CareModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();

    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(userID: string, id: string): Promise<void> {
    const result = await CareModel.findByIdAndDelete(id);
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    const user = await this.usersRepo.getById(userID);
    console.log(user);
    user.cares = user.cares.filter((item) => {
      const itemID = item as unknown as mongoose.mongo.ObjectId;
      return itemID.toString() !== id;
    });
    await this.usersRepo.update(userID, user);
  }
}
