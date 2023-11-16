// orders.repository.ts

import { OrderDocument, OrderStatus } from './schemas/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order as OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/consts/consts';
import { Order } from 'src/common/enums/system.enum';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(OrderEntity.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      return await newOrder.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    filters: Partial<OrderEntity>,
  ): Promise<OrderDocument[]> {
    try {
      const { skip, take, order } = pageOptionsDto;

      const sort: { [key: string]: 'asc' | 'desc' } = {};
      if (order) {
        sort.createdAt = order === Order.ASC ? 'asc' : 'desc';
      }

      const query = { ...filters };

      return await this.orderModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(take || DEFAULT_ITEMS_PER_PAGE)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<OrderDocument | null> {
    try {
      return await this.orderModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async countAll(): Promise<number> {
    try {
      return await this.orderModel.countDocuments().exec();
    } catch (error) {
      throw error;
    }
  }
  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDocument | null> {
    try {
      return await this.orderModel
        .findByIdAndUpdate(id, updateOrderDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.orderModel.deleteOne({ _id: id }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<OrderDocument | null> {
    try {
      return await this.orderModel.findOne({ userId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async findByDriverId(driverId: string): Promise<OrderDocument | null> {
    try {
      return await this.orderModel.findOne({ driverId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async updateOrderByDriver(
    id: string,
    driverId: string,
  ): Promise<OrderDocument | null> {
    try {
      return await this.orderModel
        .findByIdAndUpdate(
          id,
          { driverId, status: OrderStatus.InProgress },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async getCurrentOrdersForDriver(driverId: string): Promise<OrderDocument[]> {
    try {
      return await this.orderModel
        .find({ driverId, status: OrderStatus.InProgress })
        .exec();
    } catch (error) {
      throw error;
    }
  }
}
