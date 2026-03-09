import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Role } from 'generated/prisma/client';
import { UpdateUserDto } from './dto/updateUser.dto';
import bcript from 'bcrypt';
import { UserWithSameEmailException } from 'src/common/exceptions/UserWithSameEmailException';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private userSelect = {
    id: true,
    name: true,
    email: true,
    bio: true,
    role: true,
    profileImg: true,
    createdAt: true,
  };

  async checkUserExists(key: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: key },
      select: this.userSelect,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.userSelect,
    });
  }

  async findById(id: string) {
    return await this.checkUserExists(id);
  }

  async updateMe(userId: string, data: UpdateUserDto) {
    if (data.email) {
      const emailAlreadyExists = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: userId,
          },
        },
      });

      if (emailAlreadyExists) throw new UserWithSameEmailException();
    }
    const updateData = { ...data };

    if (data.password) {
      const salt = await bcript.genSalt(10);
      updateData.password = await bcript.hash(data.password, salt);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: this.userSelect,
    });
  }

  async updateRole(id: string, role: Role) {
    await this.checkUserExists(id);

    return await this.prisma.user.update({
      where: { id },
      data: { role },
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    await this.checkUserExists(id);

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso' };
  }
}
