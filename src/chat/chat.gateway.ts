import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ObjectId } from 'mongoose';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messagesService: MessagesService,
  ) {}

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: string | ObjectId) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: string | ObjectId) {
    return this.chatService.remove(id);
  }

  @SubscribeMessage('createMessage')
  async addMessage(@MessageBody() createdMessageDto: CreateMessageDto) {
    const createdMessage =
      await this.messagesService.createMessage(createdMessageDto);

    this.server.emit('newMessage', { data: createdMessage });

    return createdMessage;
  }

  @SubscribeMessage('findAllMessagesByChatId')
  async findAllMessagesByChatId(@MessageBody() chatId: string | ObjectId) {
    return this.messagesService.findAllMessagesByChatId(chatId);
  }

  @SubscribeMessage('findMessageById')
  async findMessageById(@MessageBody() id: string | ObjectId) {
    return this.messagesService.findMessageById(id);
  }

  @SubscribeMessage('deleteMessage')
  async deleteMessage(@MessageBody() id: string | ObjectId) {
    return this.messagesService.deleteMessage(id);
  }
}
