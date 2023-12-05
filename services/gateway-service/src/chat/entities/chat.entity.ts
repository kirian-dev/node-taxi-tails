import { ObjectId } from 'mongoose';
import { Message } from './message.entity';

export class Chat {
  _id: string | ObjectId;
  userId: string | ObjectId;
  driverId: string | ObjectId;
  orderId: string | ObjectId;
  message: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}
