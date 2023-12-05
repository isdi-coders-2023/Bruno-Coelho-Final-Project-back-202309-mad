import { Care } from './care.js';

export type LoginUser = {
  email: string;
  password: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  admin: boolean; // IsAdmin cambiar por normativa.
  age: number;
  cares: Care[];
};
