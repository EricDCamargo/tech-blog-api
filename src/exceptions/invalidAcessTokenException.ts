import { HttpStatus } from '@nestjs/common';
import { AppException } from './appException';

export class InvalidAcessTokenException extends AppException {
  constructor() {
    super({
      message: 'Acess token inválido ou expirado',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
