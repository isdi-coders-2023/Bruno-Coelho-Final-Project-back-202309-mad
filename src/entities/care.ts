import { ImgData } from '../types/img.data.js';
import { User } from './user';

export type Care = {
  id: string;
  name: string;
  type: string;
  description: string;
  careImg: ImgData;
  price: number;
  adminUser: User;
  adminUserID: string;
};
