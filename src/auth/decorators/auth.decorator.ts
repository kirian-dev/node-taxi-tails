import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthRoles } from 'src/common/enums/roles.enum';

export const Auth = (role: AuthRoles = AuthRoles.User) =>
  applyDecorators(
    role === AuthRoles.Admin
      ? UseGuards(JwtAuthGuard, AdminGuard)
      : UseGuards(JwtAuthGuard),
  );
