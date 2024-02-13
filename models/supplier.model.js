import mongoose from 'mongoose';
import { SUPPLIER } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const SupplierSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, required: false },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    address1: { type: String, required: true },
    address2: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SupplierSchema.plugin(paginate);

const PaginateSupplierModel = mongoose.model(SUPPLIER, SupplierSchema);

export { PaginateSupplierModel };
