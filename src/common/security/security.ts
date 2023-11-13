import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { authErrors } from '../error/auth.error';

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

export const comparePassword = (
  password: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(password, hash);

export const equalPasswords = async (
  password: string,
  confirmPassword: string,
): Promise<boolean> => {
  return password === confirmPassword;
};

export const validatePasswords = async (
  password: string,
  confirmPassword: string,
) => {
  if (!(await equalPasswords(password, confirmPassword))) {
    throw new BadRequestException(authErrors.PASSWORD_NOT_EQUAL_ERROR);
  }
};
