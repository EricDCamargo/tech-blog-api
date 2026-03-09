// src/modules/article/dto/create-article.dto.ts
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { IsNotEmptyCustom } from 'src/common/classValidator/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/common/classValidator/decorators/isStringCustom';
import { MinLengthCustom } from 'src/common/classValidator/decorators/minLengthCustom';

export class CreateArticleDto {
  @IsStringCustom()
  @IsNotEmptyCustom()
  @MinLengthCustom(5)
  title: string;

  @IsStringCustom()
  @IsNotEmptyCustom()
  description: string;

  @IsStringCustom()
  @IsNotEmptyCustom()
  banner: string;

  @IsStringCustom()
  @IsNotEmptyCustom()
  content: string;

  @IsUUID()
  @IsNotEmptyCustom()
  categoryId: string;
}
