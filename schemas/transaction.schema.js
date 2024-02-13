import Joi from 'joi';

const createTransactionSchema = Joi.object({
  mode: Joi.string().lowercase().valid('card', 'cash', 'momo'),
});

const editTransactionSchema = Joi.object({
  mode: Joi.string().lowercase().valid('card', 'cash', 'momo'),
});

export { createTransactionSchema, editTransactionSchema };
