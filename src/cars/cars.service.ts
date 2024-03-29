import { CarsRepository } from './cars.repository';
import { Injectable } from '@nestjs/common';
import { Car, CarDocument } from './schemas/car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarErrors } from 'src/common/error/cars.error';
import { PageMetaDto } from 'src/common/helpers/pagination/page-meta.dto';
import { PageDto } from 'src/common/helpers/pagination/page.dto';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { getDefault } from 'src/common/helpers/common.helper';
import {
  deletePhotosFromS3,
  uploadFilesToS3,
} from 'src/common/helpers/upload-file-s3.helper';
@Injectable()
export class CarsService {
  constructor(private readonly carsRepository: CarsRepository) {}

  async createCar(
    createCarDto: CreateCarDto,
    userId: string,
    files: Express.Multer.File[],
  ): Promise<Car> {
    try {
      const { number_plate } = createCarDto;
      const existingCar = await this.carsRepository.findByUserId(userId);
      if (existingCar) {
        throw CarErrors.UserAlreadyHasCarError;
      }

      const isNumberPlateUnique =
        await this.carsRepository.isNumberPlateUnique(number_plate);
      if (!isNumberPlateUnique) {
        throw CarErrors.NumberPlateNotUniqueError;
      }

      const photoUrls = await uploadFilesToS3({
        entityId: userId,
        entityType: 'cars',
        files,
      });
      const createdCar = await this.carsRepository.create({
        ...createCarDto,
        photoUrls,
        userId,
      });

      return createdCar;
    } catch (err) {
      throw err;
    }
  }

  async updateCar(
    id: string,
    updateCarDto: UpdateCarDto,
    files: Express.Multer.File[],
    car: CarDocument,
  ): Promise<Car | null> {
    try {
      const { number_plate } = updateCarDto;

      await deletePhotosFromS3(car.photoUrls);

      const photoUrls = await uploadFilesToS3({
        entityId: id,
        entityType: 'cars',
        files,
      });

      updateCarDto.photoUrls = photoUrls;

      if (number_plate && number_plate !== car.number_plate) {
        const isNumberPlateUnique =
          await this.carsRepository.isNumberPlateUnique(number_plate);
        if (!isNumberPlateUnique) {
          throw CarErrors.NumberPlateNotUniqueError;
        }
      }

      const updatedCar = await this.carsRepository.update(id, updateCarDto);
      return updatedCar;
    } catch (err) {
      throw err;
    }
  }

  async getAllCars(
    pageOptionsDto: PageOptionsDto,
    filters: Partial<Car>,
  ): Promise<PageDto<Car>> {
    try {
      filters.color = getDefault(filters.color, '');
      filters.brand = getDefault(filters.brand, '');
      filters.number_plate = getDefault(filters.number_plate, '');
      filters.year = getDefault(filters.year, '');

      const cars = await this.carsRepository.findAll(pageOptionsDto, filters);
      const totalCount = await this.carsRepository.countAll();
      const meta = new PageMetaDto({
        pageOptionsDto,
        itemCount: totalCount,
      });

      return new PageDto(cars, meta);
    } catch (err) {
      throw err;
    }
  }
  async getCarById(id: string): Promise<Car | null> {
    try {
      const car = await this.carsRepository.findOne(id);

      return car;
    } catch (err) {
      throw err;
    }
  }

  async deleteCar(id: string, photoUrls: string[]): Promise<boolean> {
    try {
      await deletePhotosFromS3(photoUrls);
      const isDeleted = await this.carsRepository.remove(id);
      return isDeleted;
    } catch (err) {
      throw err;
    }
  }
}
