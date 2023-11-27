import { Injectable } from '@nestjs/common';
import { OrdersRepository } from 'src/orders/orders.repository';

@Injectable()
export class DriverOrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async findOrdersNearCoordinates(coordinates: [number, number]) {
    try {
      const nearbyOrders =
        await this.ordersRepository.findOrdersNearCoordinates(coordinates);
      return nearbyOrders;
    } catch (error) {
      throw error;
    }
  }
}
