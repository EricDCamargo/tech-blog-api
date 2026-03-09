import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { UpdateCategoryDto } from './dto/UpdateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private formatCategoryName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Espaços para dashes
      .replace(/-+/g, '-') // Remove duplicata de dashes
      .trim();
  }

  async create(data: CreateCategoryDto) {
    const formattedName = this.formatCategoryName(data.name);
    const slug = this.generateSlug(formattedName);

    const categoryExists = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (categoryExists) throw new ConflictException('Esta categoria já existe');

    return this.prisma.category.create({
      data: {
        name: formattedName,
        slug,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { articles: true } },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    await this.findOne(id);

    const updateData: any = { ...data };

    if (data.name) {
      updateData.name = this.formatCategoryName(data.name);
      updateData.slug = this.generateSlug(updateData.name);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Categoria removida com sucesso' };
  }
}
