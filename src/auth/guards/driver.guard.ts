// driver.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { AuthErrors } from 'src/common/error/auth.error';

@Injectable()
export class DriverGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.roles && user.roles.includes(AuthRoles.Driver)) {
      return true;
    }

    throw AuthErrors.NoDriverAccessError;
  }
}
