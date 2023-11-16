import { ObjectId } from 'mongoose';

export class Car {
  _id: string | ObjectId;
  brand: string;
  model: string;
  year: string;
  color: string;
  number_plate: string;
  userId: string;
  photoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
