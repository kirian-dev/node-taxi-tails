import { sendVerificationEmail } from './../common/utils/email.helper';
import {
  comparePassword,
  validatePasswords,
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
import { authErrors } from 'src/common/error/auth.error';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ACCESS_EXPIRES,
  LOGOUT_SUCCESS,
  REFRESH_EXPIRES,
} from 'src/common/consts/consts';
import { generateVerificationCode } from 'src/common/utils/http.helper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      const { password, confirm_password } = dto;
      await validatePasswords(password, confirm_password);

      const existsUser = await this.authRepository.getUserByEmail(dto.email);

      if (existsUser) {
        throw new BadRequestException(authErrors.USER_EXISTS_EMAIL_ERROR);
      }
      const verificationCode = generateVerificationCode();
      const updateUserDto = {
        ...dto,
        verification_code: verificationCode,
        is_verify: false,
      };

      const newUser = await this.authRepository.createUser(updateUserDto);

      if (!newUser) {
        throw new InternalServerErrorException();
      }

      const userId: string = newUser._id || '';
      const tokens = await this.createTokens(userId);

      sendVerificationEmail(newUser.email, verificationCode, this.logger);

      return {
        user: { _id: userId },
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Error in register: ${error.message}`);
      throw error;
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { password, confirm_password } = dto;

      await validatePasswords(password, confirm_password);

      const existsUser = await this.authRepository.getUserByEmail(dto.email);

      if (!existsUser) {
        throw new BadRequestException(authErrors.INVALID_CREDENTIALS_ERROR);
      }

      const isComparePasswords = comparePassword(
        dto.password,
        existsUser.password || '',
      );

      if (!isComparePasswords) {
        throw new BadRequestException(authErrors.INVALID_CREDENTIALS_ERROR);
      }

      const userId: string = existsUser._id || '';
      const tokens = await this.createTokens(userId);
      return {
        user: { _id: userId },
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
        throw new UnauthorizedException(authErrors.INVALID_TOKEN_ERROR);
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

      const isRefreshTokenExist =
        await this.authRepository.getRefreshTokenByUserId(userId);

      if (isRefreshTokenExist) {
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
        throw new UnauthorizedException(authErrors.INVALID_TOKEN_ERROR);
      }

      const decodedToken = this.jwtService.verify(refreshToken.refresh_token);

      const user = await this.authRepository.getUserById(decodedToken._id);

      if (!user) {
        throw new UnauthorizedException(authErrors.INVALID_TOKEN_ERROR);
      }

      const tokens = await this.createTokens(String(user._id));

      return {
        user: { _id: String(user._id) },
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Error in getNewTokens: ${error.message}`);
      throw new UnauthorizedException(authErrors.INVALID_TOKEN_ERROR);
    }
  }
}
