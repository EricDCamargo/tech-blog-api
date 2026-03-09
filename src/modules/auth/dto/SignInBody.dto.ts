import { IsEmailCustom } from 'src/common/classValidator/decorators/isEmailCustom';
import { IsNotEmptyCustom } from 'src/common/classValidator/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/common/classValidator/decorators/isStringCustom';
import { MinLengthCustom } from 'src/common/classValidator/decorators/minLengthCustom';

export class SignInBody {
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;

  @IsNotEmptyCustom()
  @IsStringCustom()
  @MinLengthCustom(6)
  password: string;
}
