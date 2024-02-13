import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDocument } from './schemas/user.schema';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { Location } from 'src/common/interfaces/order.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async updateStatusDocs(userId: string, isStatus: boolean): Promise<boolean> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { isStatus },
        { new: true },
      );

      return !!updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async findDrivers(): Promise<UserDocument[]> {
    return this.userModel.find({ roles: AuthRoles.Driver }).exec();
  }

  async addCoordinates(
    userId: string,
    coordinates: Location,
  ): Promise<boolean> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { coordinates },
        { new: true },
      );

      return !!updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
