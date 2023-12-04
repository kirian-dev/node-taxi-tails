import { PageOptionsDto } from './../common/helpers/pagination/pagination.dtos';
import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/consts/consts';

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

  async findAllMessagesByChatId(
    chatId: string | ObjectId,
    pageOptions: PageOptionsDto,
  ): Promise<Message[]> {
    try {
      const { skip, take } = pageOptions;

      const query = this.messageModel
        .find({ chatId })
        .skip(skip)
        .limit(take || DEFAULT_ITEMS_PER_PAGE);
      return await query.exec();
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
