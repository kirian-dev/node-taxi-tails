import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const carErrorsConsts = {
  CAR_NOT_FOUND_ERROR: 'Car not found',
  USER_CAR_NOT_FOUND_ERROR: 'Car not found for the user',
  USER_ALREADY_HAS_CAR_ERROR: 'User already has a car',
  NUMBER_PLATE_NOT_UNIQUE_ERROR: 'Number plate must be unique',
};

export const CarErrors = {
  CarNotFoundError: new CustomError(
    carErrorsConsts.CAR_NOT_FOUND_ERROR,
    HttpStatus.NOT_FOUND,
  ),
  UserCarNotFoundError: new CustomError(
    carErrorsConsts.USER_CAR_NOT_FOUND_ERROR,
    HttpStatus.NOT_FOUND,
  ),
  UserAlreadyHasCarError: new CustomError(
    carErrorsConsts.USER_ALREADY_HAS_CAR_ERROR,
    HttpStatus.CONFLICT,
  ),
  NumberPlateNotUniqueError: new CustomError(
    carErrorsConsts.NUMBER_PLATE_NOT_UNIQUE_ERROR,
    HttpStatus.CONFLICT,
  ),
};
