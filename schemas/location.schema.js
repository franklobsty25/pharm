import Joi from 'joi';

const createLocationSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  type: Joi.string().lowercase().valid('warehouse', 'shelves'),
});

const editLocationSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  type: Joi.string().lowercase().valid('warehouse', 'shelves'),
});

export { createLocationSchema, editLocationSchema };
