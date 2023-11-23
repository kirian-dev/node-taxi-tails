import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  _id: ObjectId | string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: ObjectId | string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Chat' })
  chatId: ObjectId | string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: false })
  isDriver: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
