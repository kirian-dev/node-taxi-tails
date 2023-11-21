import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { ObjectId } from 'mongoose';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  id: string | ObjectId;
}
