import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './CreateArticle.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
