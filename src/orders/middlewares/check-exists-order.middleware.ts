import { OrdersRepository } from '../orders.repository';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { OrderErrors } from 'src/common/error/order.error';

@Injectable()
export class CheckExistsOrderMiddleware implements NestMiddleware {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const orderId: string = req.params.id;
    const userId: string = (req.user as IAuthUser).userId;

    try {
      const order = await this.ordersRepository.findOne(orderId);

      if (!order) {
        throw OrderErrors.OrderNotFoundError;
      }
      if (order.userId !== userId) {
        throw OrderErrors.ForbiddenUpdateError;
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
