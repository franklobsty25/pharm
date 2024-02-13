import Joi from 'joi';

const createOrderSchema = Joi.object({
  amount: Joi.number().required(),
});

const editOrderSchema = Joi.object({
  amount: Joi.number(),
  status: Joi.string().lowercase().valid('pending', 'processing', 'completed'),
  date: Joi.date(),
});

export { createOrderSchema, editOrderSchema };
