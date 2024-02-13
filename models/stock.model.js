import { mongoose, SchemaTypes } from 'mongoose';
import { PRODUCT, STOCK } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const ProductStockSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    expire: { type: Date, required: true },
    sold: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    product: { type: SchemaTypes.ObjectId, required: true, ref: PRODUCT },
  },
  { timestamps: true }
);

ProductStockSchema.plugin(paginate);

const PaginateProductStockModel = mongoose.model(STOCK, ProductStockSchema);

export { PaginateProductStockModel };
