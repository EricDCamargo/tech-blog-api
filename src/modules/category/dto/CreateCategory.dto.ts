import { MaxLength } from 'class-validator';
import { IsNotEmptyCustom } from 'src/common/classValidator/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/common/classValidator/decorators/isStringCustom';
import { MinLengthCustom } from 'src/common/classValidator/decorators/minLengthCustom';

export class CreateCategoryDto {
  @IsStringCustom()
  @IsNotEmptyCustom()
  @MinLengthCustom(3)
  @MaxLength(50)
  name: string;
}
