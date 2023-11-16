import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRoles } from 'src/common/enums/roles.enum';

export interface AuthUser {
  userId: string;
  roles: AuthRoles[];
}

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
