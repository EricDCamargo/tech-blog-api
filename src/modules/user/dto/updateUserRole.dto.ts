import { Role } from 'generated/prisma/enums';
import { IsStringCustom } from 'src/common/classValidator/decorators/isStringCustom';

export class UpdateUserRoleDto {
  @IsStringCustom()
  role: Role;
}
