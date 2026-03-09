import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateArticleDto } from './dto/CreateArticle.dto';
import { Role } from 'generated/prisma/client';
import { UpdateArticleDto } from './dto/UpdateArticle.dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  async create(authorId: string, data: CreateArticleDto) {
    const slug = this.generateSlug(data.title);

    const slugExists = await this.prisma.article.findUnique({
      where: { slug },
    });
    if (slugExists)
      throw new ConflictException('Já existe um artigo com este título');

    // Verifica se a categoria existe
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');

    const readingTime = this.calculateReadingTime(data.content);

    return this.prisma.article.create({
      data: {
        ...data,
        slug,
        readingTime,
        authorId,
      },
    });
  }

  // src/modules/article/article.service.ts

  async update(
    articleId: string,
    userId: string,
    userRole: Role,
    data: UpdateArticleDto,
  ) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: { authorId: true },
    });

    if (!article) throw new NotFoundException('Artigo não encontrado');

    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN;
    const isOwner = article.authorId === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este artigo',
      );
    }

    const updateData: any = { ...data };

    if (data.title) {
      updateData.slug = this.generateSlug(data.title);

      const slugExists = await this.prisma.article.findFirst({
        where: {
          slug: updateData.slug,
          id: { not: articleId },
        },
      });
      if (slugExists)
        throw new ConflictException('Já existe um artigo com este novo título');
    }

    if (data.content) {
      updateData.readingTime = this.calculateReadingTime(data.content);
    }

    return this.prisma.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    });
  }

  async findAll(params: {
    page?: string;
    perPage?: string;
    category?: string;
    search?: string;
  }) {
    const { page, perPage, category, search } = params;

    const currentPage = Number(page) || 1;
    const currentPerPage = Number(perPage) || 20;
    const skip = (currentPage - 1) * currentPerPage;

    const where: any = {
      published: true,
    };

    if (category) {
      where.category = {
        OR: [{ slug: category }, { name: { contains: category } }],
      };
    }

    if (search) {
      where.title = {
        contains: search,
      };
    }

    const [articles, totalItems] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: { select: { name: true, profileImg: true } },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: currentPerPage,
        skip,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      meta: {
        totalItems,
        itemCount: articles.length,
        currentPage,
        itemsPerPage: currentPerPage,
        totalPages: Math.ceil(totalItems / currentPerPage),
      },
    };
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
      include: {
        author: {
          select: {
            name: true,
            profileImg: true,
          },
        },
        category: true,
        tags: true,
      },
    });
    if (!article) throw new NotFoundException('Artigo não encontrado');
    return article;
  }

  async remove(articleId: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado');
    }

    const canDelete =
      userRole === Role.ADMIN ||
      userRole === Role.SUPER_ADMIN ||
      article.authorId === userId;

    if (!canDelete) {
      throw new ForbiddenException(
        'Não tens permissão para remover este artigo',
      );
    }

    await this.prisma.article.delete({ where: { id: articleId } });

    return { message: 'Artigo removido com sucesso' };
  }
}
