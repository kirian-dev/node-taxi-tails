import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { AuthRoles } from 'src/common/enums/roles.enum';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User extends Document {
  _id: ObjectId | string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: [String], enum: AuthRoles, default: [AuthRoles.User] })
  roles: AuthRoles[];

  @Prop({ type: Boolean, default: false })
  is_verify_docs: boolean;

  @Prop({ type: [] })
  coordinates: [number, number];

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
