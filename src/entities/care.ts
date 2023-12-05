import { User } from './user';

export type Care = {
  id: string;
  name: string;
  type: string; // Se puede cambiar por typos futuros en razon del servicio
  description: string;
  // CareFrontImg: ImgData;
  // careBackImg: ImgData;
  price: number;
  adminUser: User;
  adminUserID: string;
};
