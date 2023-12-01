import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
  Canceled = 'canceled',
  InProgress = 'in_progress',
}

@Schema({ collection: 'orders' })
export class Order extends Document {
  _id: ObjectId | string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: Types.ObjectId, required: false, ref: 'User' })
  driverId: string | null;

  @Prop({ required: true, type: Object, index: '2dsphere' })
  pickupLocation: {
    type: {
      type: string;
      enum: ['Point'];
      default: 'Point';
    };
    coordinates: [number, number];
  };

  @Prop({ required: true, type: Array })
  dropOffLocations: [number, number][];

  @Prop({ required: true })
  fare: number;

  @Prop({ default: OrderStatus.Pending })
  status: OrderStatus;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
