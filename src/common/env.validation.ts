import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_AT_SECRET: Joi.string().required(),
  JWT_RT_SECRET: Joi.string().required(),
  PORT: Joi.number().default(3333),
});
