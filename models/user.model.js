import mongoose from 'mongoose';
import { RolesEnum, USER } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, required: false },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: RolesEnum.SUPERADMIN },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.plugin(paginate);

const PaginateUserModel = mongoose.model(USER, UserSchema);

export { PaginateUserModel };
