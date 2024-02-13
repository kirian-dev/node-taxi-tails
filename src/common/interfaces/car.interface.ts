import { CarDocument } from './../../cars/schemas/car.schema';
import { Request } from 'express';

export interface ICarRequest extends Request {
  car?: CarDocument;
}
