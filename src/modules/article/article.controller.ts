import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { UpdateArticleDto } from './dto/UpdateArticle.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria um novo artigo' })
  @ApiResponse({ status: 201, description: 'Artigo criado com sucesso.' })
  create(
    @GetCurrentUserId() userId: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(userId, createArticleDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um artigo existente' })
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
  @ApiOperation({ summary: 'Lista artigos com paginação e filtros' })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'perPage', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.articleService.findAll({ page, perPage, category, search });
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Busca um artigo pelo slug (URL amigável)' })
  findOne(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um artigo' })
  remove(
    @Param('id', ParseUUIDPipe) articleId: string,
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('role') role: Role,
  ) {
    return this.articleService.remove(articleId, userId, role);
  }
}
