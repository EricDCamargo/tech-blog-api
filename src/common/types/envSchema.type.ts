export type Environment = 'DEV' | 'PROD';
export interface EnvConfig {
  DATABASE_URL: string;
  JWT_AT_SECRET: string;
  JWT_RT_SECRET: string;
  ENVIRONMENT: Environment;
  PORT: number;
}
