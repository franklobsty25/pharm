import Joi from 'joi';

const createProductStockSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  category: Joi.string()
    .lowercase()
    .valid('capsule', 'cosmetic', 'grocery', 'syrup', 'tablet')
    .trim()
    .required(),
  unitPrice: Joi.number().required(),
  quantity: Joi.number().required(),
  expire: Joi.date().required(),
});

export { createProductStockSchema };
