import { ObjectId } from 'mongoose';

export class Car {
  _id: string | ObjectId;
  brand: string;
  model: string;
  year: number;
  color: string;
  number_plate: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
