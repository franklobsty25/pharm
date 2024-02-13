import { PaginateAuditModel } from '../models/audit.model.js';
import { PaginateUserModel } from '../models/user.model.js';
import { auditLogSchema } from '../schemas/audit.schema.js';

const getAuditLogs = async (req, res, next) => {
  const audits = await PaginateAuditModel.find({
    isDeleted: { $ne: true },
  }).populate({
    path: 'creator',
    select: 'firstname lastname phoneNumber email role',
  });

  const _audits = audits.map((audit) => {
    return {
      firstname: audit.creator.firstname,
      lastname: audit.creator.lastname,
      phonenumber: audit.creator.phoneNumber,
      email: audit.creator.email,
      role: audit.creator.role,
      message: audit.message,
    };
  });

  res.json({ data: _audits });
};

const createAuditLog = async (payload) => {
  try {
    const { error, value } = auditLogSchema.validate(payload);

    if (error) throw error;

    await PaginateAuditModel.create(value);
  } catch (error) {
    throw error;
  }
};

export { getAuditLogs, createAuditLog };
