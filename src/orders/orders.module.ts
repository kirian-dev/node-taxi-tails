import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';
import { CheckExistsOrderMiddleware } from './middlewares/check-exists-order.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
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
