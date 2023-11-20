import { ObjectId } from 'mongoose';

export class Document {
  _id: string | ObjectId;
  userId: string | ObjectId;
  documentType: string;
  documentNumber: number;
  series: string;
  issueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
