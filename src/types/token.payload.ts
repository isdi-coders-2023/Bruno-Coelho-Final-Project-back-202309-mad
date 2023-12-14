import { User } from '../entities/user';
import jwt from 'jsonwebtoken';

export type TokenPayload = {
  id: User['id'];
  email: string;
  admin: true;
} & jwt.JwtPayload;
