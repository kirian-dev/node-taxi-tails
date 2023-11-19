import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthRoles } from 'src/common/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (roles: AuthRoles[] = []) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  );
