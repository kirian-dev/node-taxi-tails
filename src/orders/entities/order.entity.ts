import { ObjectId } from 'mongoose';
import { Location, OrderStatus } from '../schemas/order.schema';

export class Order {
  _id: ObjectId | string;
  userId: string;
  driverId: string | null;
  pickupLocation: Location;
  dropOffLocation: Location;
  fare: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
