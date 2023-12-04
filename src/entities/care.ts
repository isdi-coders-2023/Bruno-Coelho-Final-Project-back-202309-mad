import { ImgData } from '../types/img.data.js';
import { User } from './user';

export type Care = {
  id: string;
  name: string;
  type: string; // Se puede cambiar por typos futuros en razon del servicio
  description: string;
  careFrontImg: ImgData;
  careBackImg: ImgData;
  price: number;
  creator: User;
};
