import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { AuthErrors } from 'src/common/error/auth.error';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.roles || [];
    if (!userRoles.some((role: AuthRoles) => requiredRoles.includes(role))) {
      throw AuthErrors.NoAccessError;
    }

    return true;
  }
}
