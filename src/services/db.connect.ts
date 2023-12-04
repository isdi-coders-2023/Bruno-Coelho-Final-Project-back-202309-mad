import mongoose from 'mongoose';
import 'dotenv/config';

export const dbConnect = () => {
  const user = process.env.USER_DB;
  const password = process.env.PASSWORD_DB;
  const cluster = 'cluster0.vjniyww.mongodb.net';
  const dataBase = 'CaresBruno';
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dataBase}?retryWrites=true&w=majority`;

  return mongoose.connect(uri);
};
