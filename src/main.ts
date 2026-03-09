import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { IncorrectValuesExceptions } from './exceptions/incorrectValuesExceptions';
import { mapperClassValidationErrorToAppException } from './utils/mappers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors: ValidationError[]) {
        throw new IncorrectValuesExceptions({
          fields: mapperClassValidationErrorToAppException(errors),
        });
      },
    }),
  );

  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);
  console.log(`App is runing on port: ${port} 🚀`);
}
bootstrap();
