import mongoose from 'mongoose';
import { AUDIT, USER } from '../constants/constant.js';
import paginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const AuditSchema = new Schema({
  creator: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: USER },
  message: { type: String, required: true },
  metadata: { type: mongoose.SchemaTypes.Mixed },
  isDeleted: { type: Boolean, default: false },
});

AuditSchema.plugin(paginate);

const PaginateAuditModel = mongoose.model(AUDIT, AuditSchema);

export { PaginateAuditModel };
