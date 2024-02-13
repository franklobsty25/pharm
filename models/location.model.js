import mongoose from 'mongoose';
import { LOCATION, LocationTypeEnum } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, default: LocationTypeEnum.SHELVES },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LocationSchema.plugin(paginate);

const PaginateLocationModel = mongoose.model(LOCATION, LocationSchema);

export { PaginateLocationModel };
