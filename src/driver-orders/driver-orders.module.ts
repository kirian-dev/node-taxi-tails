import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DriverOrdersService } from './driver-orders.service';
import { DriverOrdersGateway } from './driver-orders.gateway';
import { OrdersRepository } from 'src/orders/orders.repository';
import { UsersService } from 'src/users/users.service';
import { OrderSchema } from 'src/orders/schemas/order.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    DriverOrdersGateway,
    DriverOrdersService,
    OrdersRepository,
    UsersService,
    UsersRepository,
  ],
})
export class DriverOrdersModule {}
