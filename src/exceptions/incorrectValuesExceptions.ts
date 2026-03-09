import { HttpStatus } from '@nestjs/common';
import { AppException, AppExceptionProps } from './appException';

interface IncorrectValuesExceptionsProps {
  fields: AppExceptionProps['fields'];
}

export class IncorrectValuesExceptions extends AppException {
  constructor({ fields }: IncorrectValuesExceptionsProps) {
    super({
      message: 'Dados invalidos',
      status: HttpStatus.BAD_REQUEST,
      fields,
    });
  }
}
