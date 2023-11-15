import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const authErrorsConsts = {
  INVALID_CREDENTIALS_ERROR: 'Invalid credentials',
  PASSWORD_NOT_EQUAL_ERROR: 'Passwords do not match',
  EMAIL_BUSY_ERROR: 'Email is busy',
  INVALID_TOKEN_ERROR: 'Invalid token or expired',
  ACCESS_RIGHTS_ERROR: 'You do not have access rights',
  INVALID_ID_ERROR: 'Invalid format id',
  USER_ALREADY_EXISTS_ERROR: 'User already exists',
  USER_EXISTS_EMAIL_ERROR: 'User with this email already exists',
  USER_NOT_FOUND_ERROR: 'User not found',
  NO_ACCESS_RIGHTS_ERROR: 'No access rights',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED_ERROR: 'Unauthorized ',
  NOT_FOUND_ERROR: 'Not found',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
};

export const AuthErrors = {
  UserExistsEmailError: new CustomError(
    authErrorsConsts.USER_EXISTS_EMAIL_ERROR,
    HttpStatus.BAD_REQUEST,
  ),
  InvalidCredentialsError: new CustomError(
    authErrorsConsts.INVALID_CREDENTIALS_ERROR,
    HttpStatus.BAD_REQUEST,
  ),
  InvalidTokenError: new CustomError(
    authErrorsConsts.INVALID_TOKEN_ERROR,
    HttpStatus.UNAUTHORIZED,
  ),
  InternalServerError: new CustomError(
    authErrorsConsts.INTERNAL_SERVER_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  RefreshTokenNotFoundError: new CustomError(
    authErrorsConsts.REFRESH_TOKEN_NOT_FOUND,
    HttpStatus.NOT_FOUND,
  ),
  NoAccessError: new CustomError(
    authErrorsConsts.NO_ACCESS_RIGHTS_ERROR,
    HttpStatus.FORBIDDEN,
  ),
  PasswordsNotEqualError: new CustomError(
    authErrorsConsts.PASSWORD_NOT_EQUAL_ERROR,
    HttpStatus.BAD_REQUEST,
  ),
  NoDriverAccessError: new CustomError(
    authErrorsConsts.NO_ACCESS_RIGHTS_ERROR,
    HttpStatus.FORBIDDEN,
  ),
};
