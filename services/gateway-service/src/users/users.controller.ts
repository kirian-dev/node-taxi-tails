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
import { Location } from 'src/common/interfaces/common.interface';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@Auth([AuthRoles.Admin])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
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
  async remove(@Param('id', IdValidationPipe) id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Auth([AuthRoles.User, AuthRoles.Driver])
  @Patch('/coordinates')
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
