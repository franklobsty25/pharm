import mongoose from 'mongoose';
import { CUSTOMER } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, required: false },
    phoneNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CustomerSchema.plugin(paginate);
CustomerSchema.virtual('fullName').get(function () {
  return `${this.firstname} ${this.lastname}`;
});

const PaginateCustomerModel = mongoose.model(CUSTOMER, CustomerSchema);

export { PaginateCustomerModel };
