import * as config from '@nestjs/config';
import { EnvConfig } from './envSchema.type';

declare module '@nestjs/config' {
  export class ConfigService<
    K = EnvConfig,
    WasValidated extends boolean = true,
  > {
    getOrThrow<P extends keyof K>(key: P): K[P];
    get<P extends keyof K>(key: P): K[P];
  }
}
