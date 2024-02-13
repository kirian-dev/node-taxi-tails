import { ObjectId } from 'mongoose';
import { OrderStatus } from '../schemas/order.schema';

export class Order {
  _id: ObjectId | string;
  userId: ObjectId | string;
  driverId: ObjectId | string | null;
  pickupLocation: {
    coordinates: [number, number];
  };
  dropOffLocations: [number, number][];
  fare: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
