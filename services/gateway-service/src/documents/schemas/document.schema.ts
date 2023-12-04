import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, ObjectId, Types } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema({ collection: 'documents' })
export class Document {
  _id: ObjectId | string;

  @Prop({ required: true })
  documentType: string;

  @Prop({ required: true })
  documentNumber: number;

  @Prop({ required: true })
  series: string;

  @Prop({ required: true })
  issueDate: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: ObjectId | string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
