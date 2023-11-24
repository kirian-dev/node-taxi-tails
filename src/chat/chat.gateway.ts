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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';

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

  @Auth([AuthRoles.Admin])
  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @Auth([AuthRoles.Driver, AuthRoles.User])
  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: string | ObjectId) {
    return this.chatService.findOne(id);
  }

  @Auth([AuthRoles.Driver, AuthRoles.User])
  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @Auth([AuthRoles.Admin])
  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: string | ObjectId) {
    return this.chatService.remove(id);
  }

  @Auth([AuthRoles.Driver, AuthRoles.User])
  @SubscribeMessage('createMessage')
  async addMessage(@MessageBody() createdMessageDto: CreateMessageDto) {
    const createdMessage =
      await this.messagesService.createMessage(createdMessageDto);

    this.server.emit('newMessage', { data: createdMessage });

    return createdMessage;
  }

  @Auth([AuthRoles.Driver, AuthRoles.User])
  @SubscribeMessage('findAllMessagesByChatId')
  async findAllMessagesByChatId(
    @MessageBody() chatId: string | ObjectId,
    @MessageBody() pageOptions: PageOptionsDto,
  ) {
    const messages = await this.messagesService.findAllMessagesByChatId(
      chatId,
      pageOptions,
    );
    return { data: messages, meta: pageOptions };
  }

  @Auth([AuthRoles.Driver, AuthRoles.User])
  @SubscribeMessage('findMessageById')
  async findMessageById(@MessageBody() id: string | ObjectId) {
    return this.messagesService.findMessageById(id);
  }

  @Auth([AuthRoles.Driver, AuthRoles.User])
  @SubscribeMessage('deleteMessage')
  async deleteMessage(@MessageBody() id: string | ObjectId) {
    return this.messagesService.deleteMessage(id);
  }
}
