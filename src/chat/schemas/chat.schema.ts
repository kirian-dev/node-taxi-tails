import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { Message } from './message.schema';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  _id: ObjectId | string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Message[];

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: ObjectId | string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  driverId: ObjectId | string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
