import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private readonly hierarchy = {
    [Role.USER]: [Role.USER],
    [Role.ADMIN]: [Role.ADMIN, Role.USER],
    [Role.SUPER_ADMIN]: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied');
    }

    // Pega os cargos que o cargo atual do usuário permite acessar
    const userAllowedRoles = this.hierarchy[user.role] || [];

    // Verifica se algum dos cargos permitidos pelo cargo do usuário atende ao requisito da rota
    const hasPermission = requiredRoles.some((role) =>
      userAllowedRoles.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}
