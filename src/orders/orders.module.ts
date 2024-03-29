import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { CheckExistsOrderMiddleware } from './middlewares/check-exists-order.middleware';
import { User } from 'src/users/entities/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { ChatRepository } from 'src/chat/chat.repository';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatSchema } from 'src/chat/schemas/chat.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, UsersRepository, OrdersRepository, ChatRepository],
  exports: [OrdersRepository],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckExistsOrderMiddleware)
      .forRoutes(
        { path: 'orders/:id', method: RequestMethod.PUT },
        { path: 'orders/:id', method: RequestMethod.DELETE },
      );
  }
}
