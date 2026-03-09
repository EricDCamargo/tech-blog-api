import { IsOptional } from 'class-validator';
import { IsEmailCustom } from 'src/common/classValidator/decorators/isEmailCustom';
import { IsStringCustom } from 'src/common/classValidator/decorators/isStringCustom';
import { MinLengthCustom } from 'src/common/classValidator/decorators/minLengthCustom';

export class UpdateUserDto {
  @IsStringCustom()
  @IsOptional()
  name?: string;

  @IsStringCustom()
  @IsEmailCustom()
  @IsOptional()
  email?: string;

  @IsStringCustom()
  @MinLengthCustom(6)
  @IsOptional()
  password?: string;
}
