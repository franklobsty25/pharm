import Joi from 'joi';

const createOrderDetailSchema = Joi.object({
  order: Joi.string().required().trim(),
  product: Joi.string().required().trim(),
  quantity: Joi.number(),
  unitPrice: Joi.number().required(),
  description: Joi.string().trim(),
});

const editOrderDetailSchema = Joi.object({
  description: Joi.string(),
  quantity: Joi.number(),
  unitPrice: Joi.number(),
});

export { createOrderDetailSchema, editOrderDetailSchema };
