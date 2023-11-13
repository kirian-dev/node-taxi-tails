import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.usersRepository.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user',
        error.message,
      );
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching users',
        error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user by ID',
        error.message,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating user',
        error.message,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.usersRepository.remove(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error removing user',
        error.message,
      );
    }
  }
}
