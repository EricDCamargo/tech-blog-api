import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { IncorrectValuesExceptions } from './common/exceptions/incorrectValuesExceptions';
import { mapperClassValidationErrorToAppException } from './utils/mappers';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mind Blog API')
    .setDescription('Documentação da API do Blog')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(cookieParser());
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors: ValidationError[]) {
        throw new IncorrectValuesExceptions({
          fields: mapperClassValidationErrorToAppException(errors),
        });
      },
    }),
  );

  const port = configService.getOrThrow('PORT');

  await app.listen(port);
  console.log(`App is runing on port: ${port} 🚀`);
}
bootstrap();
