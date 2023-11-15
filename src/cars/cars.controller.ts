import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { CreateCarResponseDto } from './dto/create-car-response.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { PageOptionsDto } from 'src/common/helpers/pagination/pagination.dtos';
import { PageDto } from 'src/common/helpers/pagination/page.dto';
import { Car } from './entities/car.entity';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Car created successfully',
    type: CreateCarResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createCar(
    @Body() createCarDto: CreateCarDto,
    @AuthUser() user: AuthUser,
  ) {
    const userId = user.userId;
    const createdCar = await this.carsService.createCar({
      ...createCarDto,
      userId: userId,
    });
    return { success: true, data: createdCar };
  }

  @Get()
  @Auth(AuthRoles.Admin)
  @ApiResponse({
    status: 200,
    description: 'List of cars',
  })
  @ApiQuery({ name: 'color', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'numberPlate', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllCars(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('color') color: string,
    @Query('brand') brand: string,
    @Query('numberPlate') numberPlate: string,
    @Query('year') year: number,
  ) {
    const filters: Partial<Car> = {
      color,
      brand,
      number_plate: numberPlate,
      year,
    };

    const result: PageDto<Car> = await this.carsService.getAllCars(
      pageOptionsDto,
      filters,
    );

    return { success: true, data: result.data, meta: result.meta };
  }

  @Get(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Car details',
    type: CreateCarResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getCarById(@Param('id') id: string, @AuthUser() user: AuthUser) {
    const userId = user.userId;

    const car = await this.carsService.getCarById(id, userId);
    return { success: true, data: car };
  }

  @Put(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Car updated successfully',
    type: CreateCarResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateCar(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @AuthUser() user: AuthUser,
  ) {
    const userId = user.userId;

    const updatedCar = await this.carsService.updateCar(id, {
      ...updateCarDto,
      userId: userId,
    });
    return { success: true, data: updatedCar };
  }

  @Delete(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Car deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteCar(@Param('id') id: string, @AuthUser() user: AuthUser) {
    const userId = user.userId;
    const isDeleted = await this.carsService.deleteCar(id, userId);
    return { success: true, data: isDeleted };
  }
}