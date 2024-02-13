import Joi from 'joi';

const createCartSchema = Joi.object({
  product: Joi.string().required().trim(),
  quantity: Joi.number(),
  unitPrice: Joi.number().required(),
  description: Joi.string().trim(),
});

export { createCartSchema };
