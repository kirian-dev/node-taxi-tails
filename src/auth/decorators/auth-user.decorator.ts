import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as IAuthUser;
  },
);
