import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car, CarSchema } from './schemas/car.schema';
import { CarsRepository } from './cars.repository';
import { CheckCarOwnerMiddleware } from './middlewares/check-car-owner.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }])],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository],
})
export class CarsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckCarOwnerMiddleware)
      .forRoutes(
        { path: 'cars/:id', method: RequestMethod.GET },
        { path: 'cars/:id', method: RequestMethod.PUT },
        { path: 'cars/:id', method: RequestMethod.DELETE },
      );
  }
}
