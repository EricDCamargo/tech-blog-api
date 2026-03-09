import { HttpStatus } from '@nestjs/common';
import { AppException } from './appException';

export class UserWithSameEmailException extends AppException {
  constructor() {
    super({
      message: 'Email já cadastrado',
      status: HttpStatus.CONFLICT,
    });
  }
}
