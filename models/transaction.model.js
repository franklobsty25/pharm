import { mongoose, SchemaTypes } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import {
  ORDER,
  TRANSACTION,
  TransactionModeEnum,
} from '../constants/constant.js';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    mode: { type: String, default: TransactionModeEnum.CASH },
    isDeleted: { type: Boolean, default: false },
    order: { type: SchemaTypes.ObjectId, required: true, ref: ORDER },
  },
  { timestamps: true }
);

TransactionSchema.plugin(paginate);

const PaginateTransactionModel = mongoose.model(TRANSACTION, TransactionSchema);

export { PaginateTransactionModel };
