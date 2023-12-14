import { Schema, model } from 'mongoose';
import { Care } from '../../entities/care';

const caresSchema = new Schema<Care>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['hair', 'eyebrows', 'eyelashes', 'nails'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  careImg: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
  },
  price: {
    type: Number,
  },
});

caresSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const CareModel = model<Care>('Care', caresSchema, 'cares');
