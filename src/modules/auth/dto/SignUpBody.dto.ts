import { IsEmailCustom } from 'src/common/classValidator/decorators/isEmailCustom';
import { IsNotEmptyCustom } from 'src/common/classValidator/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/common/classValidator/decorators/isStringCustom';

export class SignUpBody {
  @IsNotEmptyCustom()
  @IsStringCustom()
  name: string;
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;
  @IsNotEmptyCustom()
  @IsStringCustom()
  password: string;
}
