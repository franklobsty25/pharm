import { mongoose, SchemaTypes } from 'mongoose';
import { CUSTOMER, ORDER, OrderStatusEnum } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    amount: { type: Number, required: true },
    status: { type: String, default: OrderStatusEnum.PENDING },
    completedDate: { type: Date, default: new Date() },
    isDeleted: { type: Boolean, default: false },
    customer: { type: SchemaTypes.ObjectId, require: true, ref: CUSTOMER },
  },
  { timestamps: true }
);

OrderSchema.plugin(paginate);

const PaginateOrderModel = mongoose.model(ORDER, OrderSchema);

export { PaginateOrderModel };
