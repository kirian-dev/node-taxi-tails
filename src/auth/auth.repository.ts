// auth.repository.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { INVALID_TOKEN_ERROR } from 'src/common/error/auth.error';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`Error getting user by email: ${error.message}`);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      this.logger.error(`Error getting user by ID: ${error.message}`);
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
      this.logger.error(`Error creating refresh token: ${error.message}`);
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
        throw new Error('Refresh token not found');
      }

      return refreshToken;
    } catch (error) {
      this.logger.error(`Error updating refresh token: ${error.message}`);
      throw error;
    }
  }

  async getRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    try {
      return await this.refreshTokenModel.findOne({ token }).exec();
    } catch (error) {
      this.logger.error(
        `Error getting refresh token by token: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    try {
      const result = await this.refreshTokenModel.findOneAndDelete({ token });

      if (!result) {
        throw new UnauthorizedException(INVALID_TOKEN_ERROR);
      }
    } catch (error) {
      this.logger.error(`Error deleting refresh token: ${error.message}`);
      throw error;
    }
  }

  async getRefreshTokenByUserId(userId: string): Promise<RefreshToken | null> {
    try {
      return await this.refreshTokenModel.findOne({ userId }).exec();
    } catch (error) {
      this.logger.error(
        `Error getting refresh token by userId: ${error.message}`,
      );
      throw error;
    }
  }
}
