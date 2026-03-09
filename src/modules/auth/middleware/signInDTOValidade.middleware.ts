import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { mapperClassValidationErrorToAppException } from 'src/utils/mappers';
import { IncorrectValuesExceptions } from 'src/common/exceptions/incorrectValuesExceptions';
import { SignInBody } from '../dto/SignInBody.dto';

@Injectable()
export class SignInDTOValidadeMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const signInBody = new SignInBody();
    signInBody.email = body.email;
    signInBody.password = body.password;

    const validations = await validate(signInBody);

    if (validations.length) {
      throw new IncorrectValuesExceptions({
        fields: mapperClassValidationErrorToAppException(validations),
      });
    }
    next();
  }
}
