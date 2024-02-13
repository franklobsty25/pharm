import { mongoose, SchemaTypes } from 'mongoose';
import { PRODUCT, SUPPLIER } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    expire: { type: Date, required: true },
    sold: { type: Number, default: 0 },
    reorder: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    supplier: { type: SchemaTypes.ObjectId, required: true, ref: SUPPLIER },
  },
  { timestamps: true }
);

ProductSchema.plugin(paginate);

const PaginateProductModel = mongoose.model(PRODUCT, ProductSchema);

export { PaginateProductModel };
