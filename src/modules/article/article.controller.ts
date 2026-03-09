import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ArticleService } from './article.service';

import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import { Role } from 'generated/prisma/client';
import { UpdateArticleDto } from './dto/UpdateArticle.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(userId, createArticleDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) articleId: string,
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('role') role: Role,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(
      articleId,
      userId,
      role,
      updateArticleDto,
    );
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.articleService.findAll({
      page,
      perPage,
      category,
      search,
    });
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) articleId: string,
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('role') role: Role,
  ) {
    return this.articleService.remove(articleId, userId, role);
  }
}
