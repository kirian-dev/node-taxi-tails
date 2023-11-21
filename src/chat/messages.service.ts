import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      return await this.messagesRepository.createMessage(createMessageDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllMessages(): Promise<Message[]> {
    try {
      return await this.messagesRepository.findAllMessages();
    } catch (error) {
      throw error;
    }
  }

  async findMessageById(id: string | ObjectId): Promise<Message | null> {
    try {
      return await this.messagesRepository.findMessageById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAllMessagesByChatId(chatId: string | ObjectId): Promise<Message[]> {
    try {
      return await this.messagesRepository.findAllMessagesByChatId(chatId);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(id: string | ObjectId): Promise<Message | null> {
    try {
      return await this.messagesRepository.deleteMessage(id);
    } catch (error) {
      throw error;
    }
  }
}
