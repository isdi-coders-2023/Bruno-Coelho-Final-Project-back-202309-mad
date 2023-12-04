Import { ImgData } from '../types/img.data';
import { Care } from './care.js';

export type LoginUser = {
  email: string;
  password: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  age: number;
  beautyCare: Care[];
  avatar: ImgData;
  role: 'Admin' | 'User';
};

