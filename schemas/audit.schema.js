import Joi from 'joi';

const auditLogSchema = Joi.object({
  creator: Joi.string().required().trim(),
  message: Joi.string().required().trim(),
  metadata: Joi.object(),
});

export { auditLogSchema };
