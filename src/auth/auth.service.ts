import {
  comparePasswords,
  equalPasswords,
} from './../common/security/security';
import { AuthRepository } from './auth.repository';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  INVALID_CREDENTIALS_ERROR,
  INVALID_TOKEN_ERROR,
  PASSWORD_NOT_EQUAL_ERROR,
  USER_EXISTS_EMAIL_ERROR,
} from 'src/common/error/auth.error';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ACCESS_EXPIRES,
  LOGOUT_SUCCESS,
  REFRESH_EXPIRES,
} from 'src/common/consts/consts';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      const isMatchPasswords = await equalPasswords(
        dto.password,
        dto.confirm_password,
      );

      if (!isMatchPasswords) {
        throw new BadRequestException(PASSWORD_NOT_EQUAL_ERROR);
      }

      const existsUser = await this.authRepository.getUserByEmail(dto.email);

      if (existsUser) {
        throw new BadRequestException(USER_EXISTS_EMAIL_ERROR);
      }

      const newUser = await this.authRepository.createUser(dto);

      if (!newUser) {
        throw new InternalServerErrorException();
      }

      const tokens = await this.createTokens(String(newUser._id));
      return {
        user: this.userResponseWithId(newUser),
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Error in register: ${error.message}`);
      throw error;
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const isMatchPasswords = await equalPasswords(
        dto.password,
        dto.confirm_password,
      );

      if (!isMatchPasswords) {
        throw new BadRequestException(PASSWORD_NOT_EQUAL_ERROR);
      }

      const existsUser = await this.authRepository.getUserByEmail(dto.email);

      if (!existsUser) {
        throw new BadRequestException(INVALID_CREDENTIALS_ERROR);
      }

      const isComparePasswords = comparePasswords(
        dto.password,
        existsUser.password || '',
      );

      if (!isComparePasswords) {
        throw new BadRequestException(INVALID_CREDENTIALS_ERROR);
      }

      const tokens = await this.createTokens(String(existsUser._id));
      return {
        user: this.userResponseWithId(existsUser),
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Error in login: ${error.message}`);
      throw error;
    }
  }

  async logout(dto: RefreshTokenDto) {
    try {
      if (!dto.refresh_token) {
        throw new UnauthorizedException(INVALID_TOKEN_ERROR);
      }

      await this.authRepository.deleteRefreshToken(dto.refresh_token);

      return { message: LOGOUT_SUCCESS };
    } catch (error) {
      this.logger.error(`Error in logout: ${error.message}`);
      throw error;
    }
  }

  async createTokens(userId: string) {
    try {
      const data = { _id: userId };

      const accessToken = this.jwtService.sign(data, {
        expiresIn: ACCESS_EXPIRES,
      });
      const refreshToken = this.jwtService.sign(data, {
        expiresIn: REFRESH_EXPIRES,
      });

      const existingRefreshToken =
        await this.authRepository.getRefreshTokenByUserId(userId);

      if (existingRefreshToken) {
        await this.authRepository.updateRefreshToken(
          userId,
          refreshToken,
          new Date(Date.now() + REFRESH_EXPIRES),
        );
      } else {
        await this.authRepository.createRefreshToken(
          userId,
          refreshToken,
          new Date(Date.now() + REFRESH_EXPIRES),
        );
      }

      return { refreshToken, accessToken };
    } catch (error) {
      this.logger.error(`Error in createTokens: ${error.message}`);
      throw error;
    }
  }

  async getNewTokens(refreshToken: RefreshTokenDto) {
    try {
      if (!refreshToken.refresh_token) {
        throw new UnauthorizedException(INVALID_TOKEN_ERROR);
      }

      const result = this.jwtService.verify(refreshToken.refresh_token);

      const user = await this.authRepository.getUserById(result._id);

      if (!user) {
        throw new UnauthorizedException(INVALID_TOKEN_ERROR);
      }

      const tokens = await this.createTokens(String(user._id));

      return {
        user: this.userResponseWithId(user),
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Error in getNewTokens: ${error.message}`);
      throw new UnauthorizedException(INVALID_TOKEN_ERROR);
    }
  }

  userResponseWithId(user: User) {
    try {
      const userId: string = user._id || '';
      return {
        _id: userId,
      };
    } catch (error) {
      this.logger.error(`Error in userResponseWithId: ${error.message}`);
      throw error;
    }
  }
}
