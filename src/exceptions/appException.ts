import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppExceptionProps {
  message: string;
  status: HttpStatus;
  fields?: {
    [key: string]: string;
  };
}

export class AppException extends HttpException {
  constructor({ message, status, fields }: AppExceptionProps) {
    super({ message, fields }, status);
  }
}
