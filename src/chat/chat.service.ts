import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatRepository } from './chat.repository';
import { chatErrors } from 'src/common/error/chat.error';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async create(createChatDto: CreateChatDto) {
    try {
      const createdChat = await this.chatRepository.createChat(createChatDto);
      return createdChat;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return this.chatRepository.findAllChats();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string | ObjectId) {
    try {
      const chat = await this.chatRepository.findChatById(id);
      if (!chat) {
        throw chatErrors.ChatNotFoundError;
      }
      return chat;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string | ObjectId, updateChatDto: UpdateChatDto) {
    try {
      const updatedChat = await this.chatRepository.updateChat(
        id,
        updateChatDto,
      );
      if (!updatedChat) {
        throw chatErrors.ChatNotFoundError;
      }
      return updatedChat;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string | ObjectId) {
    try {
      const deletedChat = await this.chatRepository.deleteChat(id);
      if (!deletedChat) {
        throw chatErrors.ChatNotFoundError;
      }
      return deletedChat;
    } catch (error) {
      throw error;
    }
  }
}
