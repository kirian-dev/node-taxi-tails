import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  Req,
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
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import {
  MAX_SIZE_IMAGE_UPLOAD,
  VALID_IMAGE_FORMATS,
} from 'src/common/consts/consts';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ICarRequest } from 'src/common/interfaces/car.interface';

@Auth([AuthRoles.Driver])
@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Car created successfully',
    type: CreateCarResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseInterceptors(AnyFilesInterceptor())
  async createCar(
    @Body() createCarDto: CreateCarDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_SIZE_IMAGE_UPLOAD }),
          new FileTypeValidator({ fileType: VALID_IMAGE_FORMATS }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const userId = user.userId;
    const createdCar = await this.carsService.createCar(
      createCarDto,
      userId,
      files,
    );

    return { success: true, data: createdCar };
  }

  @Get()
  @Auth([AuthRoles.Admin])
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
    @Query('year') year: string,
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
  @ApiResponse({
    status: 200,
    description: 'Car details',
    type: CreateCarResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getCarById(@Param('id') id: string) {
    const car = await this.carsService.getCarById(id);
    return { success: true, data: car };
  }

  @Put(':id')
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
    @AuthUser() user: IAuthUser,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_SIZE_IMAGE_UPLOAD }),
          new FileTypeValidator({ fileType: VALID_IMAGE_FORMATS }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Req() req: ICarRequest,
  ) {
    if (!req.car) return;
    const userId = user.userId;
    const updatedCar = await this.carsService.updateCar(
      id,
      {
        ...updateCarDto,
        userId: userId,
      },
      files,
      req?.car,
    );
    return { success: true, data: updatedCar };
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Car deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteCar(@Param('id') id: string, @Req() req: ICarRequest) {
    const isDeleted = await this.carsService.deleteCar(
      id,
      req.car?.photoUrls || [],
    );
    return { success: true, data: isDeleted };
  }
}
