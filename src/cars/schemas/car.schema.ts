import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ collection: 'cars' })
export class Car {
  _id: ObjectId | string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, unique: true })
  number_plate: string;

  @Prop({
    required: true,
    type: String,
    ref: 'User',
  })
  userId: string;

  @Prop({ type: String })
  photoUrl: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);
