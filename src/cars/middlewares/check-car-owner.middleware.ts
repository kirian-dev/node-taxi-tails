import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CarErrors } from 'src/common/error/cars.error';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CarsRepository } from '../cars.repository';
import { ICarRequest } from 'src/common/interfaces/car.interface';

@Injectable()
export class CheckCarOwnerMiddleware implements NestMiddleware {
  constructor(private readonly carsRepository: CarsRepository) {}

  async use(req: ICarRequest, res: Response, next: NextFunction) {
    const carId: string = req.params.id;
    const userId: string = (req.user as IAuthUser)?.userId;

    try {
      const car = await this.carsRepository.findOne(carId);
      if (!car) {
        throw CarErrors.CarNotFoundError;
      }

      if (car.userId.toString() !== userId) {
        throw CarErrors.UserCarNotFoundError;
      }

      req.car = car;

      next();
    } catch (error) {
      next(error);
    }
  }
}
