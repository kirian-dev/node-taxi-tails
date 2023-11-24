import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const driverErrorsConsts = {
  ORDER_NOT_HAVE_COORDINATE_ERROR: 'Driver does not have coordinates.',
};

export const DriverErrors = {
  OrderNotFoundError: new CustomError(
    driverErrorsConsts.ORDER_NOT_HAVE_COORDINATE_ERROR,
    HttpStatus.BAD_REQUEST,
  ),
};
