import { Schema, model } from 'mongoose';
import { Care } from '../../entities/care';

const caresSchema = new Schema<Care>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  careFrontImg: {
    publicId: String,
    size: Number,
    height: Number,
    width: Number,
    format: String,
    url: String,
  },
  careBackImg: {
    publicId: String,
    size: Number,
    height: Number,
    width: Number,
    format: String,
    url: String,
  },
  price: {
    type: Number,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
