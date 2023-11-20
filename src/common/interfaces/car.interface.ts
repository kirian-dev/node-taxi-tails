import { CarDocument } from './../../cars/schemas/car.schema';
import { Request } from 'express';

export interface CarRequest extends Request {
  car?: CarDocument;
}
