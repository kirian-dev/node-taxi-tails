// auth.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { AuthErrors } from 'src/common/error/auth.error';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async createRefreshToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<RefreshToken> {
    try {
      const refreshToken = new this.refreshTokenModel({
        userId,
        token,
        expires,
      });
      return await refreshToken.save();
    } catch (error) {
      throw error;
    }
  }

  async updateRefreshToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<RefreshToken> {
    try {
      const refreshToken = await this.refreshTokenModel.findOneAndUpdate(
        { userId },
        { token, expires },
        { new: true },
      );

      if (!refreshToken) {
        throw AuthErrors.RefreshTokenNotFoundError;
      }

      return refreshToken;
    } catch (error) {
      throw error;
    }
  }

  async getRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    try {
      return await this.refreshTokenModel.findOne({ token }).exec();
    } catch (error) {
      throw error;
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    try {
      const result = await this.refreshTokenModel.findOneAndDelete({ token });

      if (!result) {
        throw AuthErrors.InvalidTokenError;
      }
    } catch (error) {
      throw error;
    }
  }

  async getRefreshTokenByUserId(userId: string): Promise<RefreshToken | null> {
    try {
      return await this.refreshTokenModel.findOne({ userId }).exec();
    } catch (error) {
      throw error;
    }
  }
}
