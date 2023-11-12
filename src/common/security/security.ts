import { genSalt, hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const comparePasswords = async (
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return compare(inputPassword, hashedPassword);
};

export const equalPasswords = async (
  password: string,
  confirmPassword: string,
): Promise<boolean> => {
  return password === confirmPassword;
};
