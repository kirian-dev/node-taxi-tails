import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    try {
      const createdChat = new this.chatModel(createChatDto);
      return await createdChat.save();
    } catch (error) {
      throw error;
    }
  }

  async findAllChats(): Promise<Chat[]> {
    try {
      return await this.chatModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findChatById(id: string | ObjectId): Promise<Chat | null> {
    try {
      return await this.chatModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async updateChat(
    id: string | ObjectId,
    updateChatDto: UpdateChatDto,
  ): Promise<Chat | null> {
    try {
      return await this.chatModel
        .findByIdAndUpdate(id, updateChatDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async deleteChat(id: string | ObjectId): Promise<Chat | null> {
    try {
      return await this.chatModel.findByIdAndRemove(id).exec();
    } catch (error) {
      throw error;
    }
  }
}
