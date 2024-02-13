import { mongoose, SchemaTypes } from 'mongoose';
import { CART, CUSTOMER, PRODUCT } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    description: { type: String, required: false },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    customer: { type: SchemaTypes.ObjectId, required: true, ref: CUSTOMER },
    product: { type: SchemaTypes.ObjectId, required: true, ref: PRODUCT },
  },
  { timestamps: true },
);

CartSchema.plugin(paginate);

const PaginateCartModel = mongoose.model(CART, CartSchema);

export { PaginateCartModel };
