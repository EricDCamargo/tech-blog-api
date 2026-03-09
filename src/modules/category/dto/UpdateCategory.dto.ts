import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './CreateCategory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
