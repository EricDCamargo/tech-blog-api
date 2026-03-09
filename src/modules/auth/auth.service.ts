import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignUpBody } from './dto/SignUpBody.dto';
import bcript from 'bcrypt';
import { AT, Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Role } from 'generated/prisma/client';
import { Response } from 'express';
import { SignInBody } from './dto/SignInBody.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private setRtCookie(res: Response, rt: string) {
    res.cookie('refreshToken', rt, {
      httpOnly: true,
      secure: this.configService.getOrThrow('ENVIRONMENT') === 'PROD',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async signup(body: SignUpBody, res: Response): Promise<AT> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) throw new ConflictException('User email already in use');

    const hashedPw = await this.hashData(body.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPw,
      },
    });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );

    await this.updateRtHash(newUser.id, tokens.refresh_token);
    this.setRtCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  async signin(body: SignInBody, res: Response): Promise<AT> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcript.compare(body.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.updateRtHash(user.id, tokens.refresh_token);
    this.setRtCookie(res, tokens.refresh_token); // Envia o RT via Cookie

    return { access_token: tokens.access_token }; // Retorna apenas o AT no JSON
  }

  async logout(userId: string, res: Response) {
    // Limpa o hash no banco de dados para invalidar futuras renovações
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: { hashedRt: null },
    });

    res.clearCookie('refreshToken'); // Remove o cookie do navegador
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: string, rt: string, res: Response): Promise<AT> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcript.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.updateRtHash(user.id, tokens.refresh_token);
    this.setRtCookie(res, tokens.refresh_token); // Rotaciona o cookie com um novo RT

    return { access_token: tokens.access_token }; // Retorna apenas o novo AT
  }

  async hashData(data: string) {
    return bcript.hash(data, 10);
  }

  async getTokens(userId: string, email: string, role: Role): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    }; // payload que está sendo colocado nos tokens
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow('JWT_AT_SECRET'),
        expiresIn: 60 * 15, //15 minutos
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow('JWT_RT_SECRET'),
        expiresIn: 60 * 60 * 24 * 7, // 7 dias
      }),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId: string, rt: string | null) {
    if (!rt) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRt: null },
      });
      return;
    }

    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }
}
