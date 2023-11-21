import { ObjectId } from 'mongoose';

export class Message {
  _id: string | ObjectId;
  userId: string | ObjectId;
  chatId: string | ObjectId;
  content: string;
  isDriver: boolean;
  createdAt: Date;
}
