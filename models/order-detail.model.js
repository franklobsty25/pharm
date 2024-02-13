import { mongoose, SchemaTypes } from 'mongoose';
import { ORDER, ORDER_DETAIL, PRODUCT } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema(
  {
    description: { type: String, required: false },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    order: { type: SchemaTypes.ObjectId, required: true, ref: ORDER },
    product: { type: SchemaTypes.ObjectId, required: true, ref: PRODUCT },
  },
  { timestamps: true }
);

OrderDetailSchema.plugin(paginate);

const PaginateOrderDetailModel = mongoose.model(
  ORDER_DETAIL,
  OrderDetailSchema
);

export { PaginateOrderDetailModel };
