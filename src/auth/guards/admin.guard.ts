// admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { authErrors } from 'src/common/error/auth.error';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.roles && user.roles.includes('admin')) {
      return true;
    }

    throw new ForbiddenException(authErrors.ACCESS_RIGHTS_ERROR);
  }
}
