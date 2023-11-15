import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { PageDto } from 'src/common/helpers/pagination/page.dto';
import { PageMetaDto } from 'src/common/helpers/pagination/page-meta.dto';
import { Order } from './entities/order.entity';
import { OrderErrors } from 'src/common/error/order.error';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.ordersRepository.create(createOrderDto);
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders(
    pageOptionsDto: PageOptionsDto,
    filters: Partial<Order>,
  ): Promise<PageDto<Order>> {
    try {
      const orders = await this.ordersRepository.findAll(
        pageOptionsDto,
        filters,
      );
      const totalCount = await this.ordersRepository.countAll();

      const meta = new PageMetaDto({
        pageOptionsDto,
        itemCount: totalCount,
      });

      return new PageDto(orders, meta);
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id: string, userId: string): Promise<Order | null> {
    try {
      const order = await this.ordersRepository.findOne(id);

      if (!order) {
        throw OrderErrors.OrderNotFoundError;
      }
      if (order.userId !== userId) {
        throw OrderErrors.ForbiddenUpdateError;
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<Order | null> {
    try {
      const order = await this.ordersRepository.findOne(id);
      if (!order) {
        throw OrderErrors.OrderNotFoundError;
      }

      if (order.userId !== userId) {
        throw OrderErrors.ForbiddenUpdateError;
      }

      return await this.ordersRepository.update(id, updateOrderDto);
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(id: string, userId: string): Promise<boolean> {
    try {
      const order = await this.ordersRepository.findOne(id);
      if (!order) {
        throw OrderErrors.OrderNotFoundError;
      }

      if (order.userId !== userId) {
        throw OrderErrors.ForbiddenDeleteError;
      }

      return await this.ordersRepository.remove(id);
    } catch (error) {
      throw error;
    }
  }

  async updateOrderByDriver(
    id: string,
    driverId: string,
  ): Promise<Order | null> {
    try {
      return await this.ordersRepository.updateOrderByDriver(id, driverId);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentOrdersForDriver(driverId: string): Promise<Order[]> {
    try {
      return await this.ordersRepository.getCurrentOrdersForDriver(driverId);
    } catch (error) {
      throw error;
    }
  }
}
