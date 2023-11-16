import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const orderErrorsConsts = {
  ORDER_NOT_FOUND_ERROR: 'Order not found',
  FORBIDDEN_UPDATE_ERROR: 'You are not allowed to update this order',
  FORBIDDEN_DELETE_ERROR: 'You are not allowed to delete this order',
};

export const OrderErrors = {
  OrderNotFoundError: new CustomError(
    orderErrorsConsts.ORDER_NOT_FOUND_ERROR,
    HttpStatus.NOT_FOUND,
  ),
  ForbiddenUpdateError: new CustomError(
    orderErrorsConsts.FORBIDDEN_UPDATE_ERROR,
    HttpStatus.FORBIDDEN,
  ),
  ForbiddenDeleteError: new CustomError(
    orderErrorsConsts.FORBIDDEN_DELETE_ERROR,
    HttpStatus.FORBIDDEN,
  ),
};
