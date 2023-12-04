// cars.repository.ts

import { CarDocument } from './schemas/car.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { DEFAULT_ITEMS_PER_PAGE } from 'src/common/consts/consts';
import { Order } from 'src/common/enums/system.enum';

@Injectable()
export class CarsRepository {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<CarDocument> {
    try {
      const newCar = new this.carModel(createCarDto);
      return await newCar.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    filters: Partial<Car>,
  ): Promise<CarDocument[]> {
    try {
      const { skip, take, order } = pageOptionsDto;

      const sort: { [key: string]: 'asc' | 'desc' } = {};
      if (order) {
        sort.createdAt = order === Order.ASC ? 'asc' : 'desc';
      }

      const query = { ...filters };
      return await this.carModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(take || DEFAULT_ITEMS_PER_PAGE)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<CarDocument | null> {
    try {
      return await this.carModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async countAll(): Promise<number> {
    try {
      return await this.carModel.countDocuments().exec();
    } catch (error) {
      throw error;
    }
  }
  async update(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<CarDocument | null> {
    try {
      return await this.carModel
        .findByIdAndUpdate(id, updateCarDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.carModel.deleteOne({ _id: id }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<CarDocument | null> {
    try {
      return await this.carModel.findOne({ userId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async isNumberPlateUnique(numberPlate: string): Promise<boolean> {
    try {
      const existingCar = await this.carModel
        .findOne({ number_plate: numberPlate })
        .exec();
      return !existingCar;
    } catch (error) {
      throw error;
    }
  }
}
