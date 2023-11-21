import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesRepository.createMessage(createMessageDto);
  }

  async findAllMessages(): Promise<Message[]> {
    return this.messagesRepository.findAllMessages();
  }

  async findMessageById(id: string | ObjectId): Promise<Message | null> {
    return this.messagesRepository.findMessageById(id);
  }

  async findAllMessagesByChatId(chatId: string | ObjectId): Promise<Message[]> {
    return this.messagesRepository.findAllMessagesByChatId(chatId);
  }

  async deleteMessage(id: string | ObjectId): Promise<Message | null> {
    return this.messagesRepository.deleteMessage(id);
  }
}
