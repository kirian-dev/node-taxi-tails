import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const createdMessage = new this.messageModel(createMessageDto);
      return await createdMessage.save();
    } catch (error) {
      throw error;
    }
  }

  async findAllMessagesByChatId(chatId: string | ObjectId): Promise<Message[]> {
    try {
      return await this.messageModel.find({ chatId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async findAllMessages(): Promise<Message[]> {
    try {
      return await this.messageModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findMessageById(id: string | ObjectId): Promise<Message | null> {
    try {
      return await this.messageModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(id: string | ObjectId): Promise<Message | null> {
    try {
      return await this.messageModel.findByIdAndRemove(id).exec();
    } catch (error) {
      throw error;
    }
  }
}
