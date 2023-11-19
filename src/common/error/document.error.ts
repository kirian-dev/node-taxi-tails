import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const documentErrorsConsts = {
  DOCUMENT_NOT_FOUND_ERROR: 'Document not found',
  USER_DOCUMENT_NOT_FOUND_ERROR: 'Document not found for the user',
  USER_ALREADY_HAS_DOCUMENT_ERROR: 'User already has a document',
};

export const documentErrors = {
  DocumentNotFoundError: new CustomError(
    documentErrorsConsts.DOCUMENT_NOT_FOUND_ERROR,
    HttpStatus.NOT_FOUND,
  ),
  UserDocumentNotFoundError: new CustomError(
    documentErrorsConsts.USER_DOCUMENT_NOT_FOUND_ERROR,
    HttpStatus.NOT_FOUND,
  ),
  UserAlreadyHasDocumentError: new CustomError(
    documentErrorsConsts.USER_ALREADY_HAS_DOCUMENT_ERROR,
    HttpStatus.CONFLICT,
  ),
};
