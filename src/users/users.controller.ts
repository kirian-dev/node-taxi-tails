import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Location } from 'src/common/interfaces/order.interface';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
@ApiTags('users')
@Auth([AuthRoles.Admin])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get list of users successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async remove(@Param('id', IdValidationPipe) id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Auth([AuthRoles.User, AuthRoles.Driver])
  @Patch('/coordinates')
  @ApiResponse({
    status: 200,
    description: 'User coordinates updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: Location })
  async addCoordinates(
    @Param('id', IdValidationPipe) id: string,
    @Body() coordinates: Location,
    @AuthUser() user: IAuthUser,
  ) {
    try {
      const { userId } = user;
      return await this.usersService.addCoordinates(userId, coordinates);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
