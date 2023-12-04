import { Care } from '../../entities/care.js';
import { CareModel } from './cares.mongo.model.js';
import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../users/users.mongo.repo.js';
import mongoose from 'mongoose';

const debug = createDebug('Cares:mongo:repo');

export class CaresMongoRepo implements Repository<Care> {
  usersRepo: UsersMongoRepo;
  constructor() {
    this.usersRepo = new UsersMongoRepo();
    debug('Instantiated');
  }

  async search({
    key,
    value,
  }: {
    key: keyof Care;
    value: unknown;
  }): Promise<Care[]> {
    const result = await CareModel.find({ [key]: value })
      .populate('creator', {
        beautyCare: 0, // BeautyCare serán mis servicios
      })
      .exec();
    return result;
  }

  async getAll(): Promise<Care[]> {
    const result = await CareModel.find()
      .populate('creator', {
        beautyCare: 0,
      })
      .exec();
    return result;
  }

  async getById(id: string): Promise<Care> {
    const result = await CareModel.findById(id)
      .populate('creator', {
        beautyCare: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async create(newItem: Omit<Care, 'id'>): Promise<Care> {
    console.log(newItem);
    const userID = newItem.creator.id;
    const user = await this.usersRepo.getById(userID);
    const result: Care = await CareModel.create({
      ...newItem,
      creator: userID,
    });
    user.beautyCare.push(result);
    await this.usersRepo.update(userID, user);
    return result;
  }

  async update(id: string, updatedItem: Partial<Care>): Promise<Care> {
    const result = await CareModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('creator', {
        beautyCare: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await CareModel.findByIdAndDelete(id)
      .populate('creator', {
        beautyCare: 0,
      })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    const userID = result.creator.id;
    const user = await this.usersRepo.getById(userID);
    user.beautyCare = user.beautyCare.filter((item) => {
      const itemID = item as unknown as mongoose.mongo.ObjectId;
      return itemID.toString() !== id;
    });
    await this.usersRepo.update(userID, user);
  }
}
