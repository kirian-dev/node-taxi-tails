// auth.decorators.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthRoles } from 'src/common/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { DriverGuard } from '../guards/driver.guard'; // Import DriverGuard

export const Auth = (
  role: AuthRoles = AuthRoles.User,
  isDriver: boolean = false,
) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ...(role === AuthRoles.Admin
      ? [
          UseGuards(JwtAuthGuard, AdminGuard),
          ApiForbiddenResponse({ description: 'Forbidden' }),
        ]
      : isDriver
      ? [
          UseGuards(JwtAuthGuard, DriverGuard),
          ApiForbiddenResponse({ description: 'Forbidden for drivers' }),
        ]
      : [UseGuards(JwtAuthGuard)]),
  );
