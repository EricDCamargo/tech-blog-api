import * as Joi from 'joi';
import { Environment } from './types/envSchema.type';

const ENVIRONMENT: Environment[] = ['DEV', 'PROD'];
const DF_ENVIRONMENT: Environment = 'DEV';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_AT_SECRET: Joi.string().required(),
  JWT_RT_SECRET: Joi.string().required(),
  ENVIRONMENT: Joi.string()
    .valid(...ENVIRONMENT)
    .default(DF_ENVIRONMENT)
    .required(),
  PORT: Joi.number().default(3333),
});
