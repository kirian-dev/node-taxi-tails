// document-errors.ts
import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const chatErrorsConsts = {
  CHAT_NOT_FOUND_ERROR: 'Chat not found',
};

export const chatErrors = {
  ChatNotFoundError: new CustomError(
    chatErrorsConsts.CHAT_NOT_FOUND_ERROR,
    HttpStatus.NOT_FOUND,
  ),
};
