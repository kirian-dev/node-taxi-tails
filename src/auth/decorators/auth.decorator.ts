import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthRoles } from 'src/common/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

export const Auth = (role: AuthRoles = AuthRoles.User) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ...(role === AuthRoles.Admin
      ? [
          UseGuards(JwtAuthGuard, AdminGuard),
          ApiForbiddenResponse({ description: 'Forbidden' }),
        ]
      : [UseGuards(JwtAuthGuard)]),
  );
