import { sendVerificationEmail } from '../common/helpers/email.helper';
import {
  comparePassword,
  hashPassword,
  validatePasswords,
} from './../common/security/security';
import { AuthRepository } from './auth.repository';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthErrors } from 'src/common/error/auth.error';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ACCESS_EXPIRES,
  LOGOUT_SUCCESS,
  REFRESH_EXPIRES,
} from 'src/common/consts/consts';
import { generateVerificationCode } from 'src/common/helpers/http.helper';
import { AuthRoles } from 'src/common/enums/roles.enum';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const { password, confirm_password, email } = dto;
      await validatePasswords(password, confirm_password);

      const existsUser = await this.authRepository.getUserByEmail(email);
      if (existsUser) {
        throw AuthErrors.UserExistsEmailError;
      }
      const hashedPassword = await hashPassword(password);
      const verificationCode = generateVerificationCode();
      const updateUserDto = {
        ...dto,
        verification_code: verificationCode,
        is_verify: false,
        password: hashedPassword,
      };

      const newUser = await this.authRepository.createUser(updateUserDto);

      if (!newUser) {
        throw AuthErrors.InternalServerError;
      }

      const userId: string = newUser._id || '';
      const tokens = await this.createTokens(userId, newUser.roles);

      sendVerificationEmail(newUser.email, verificationCode, this.logger);

      return {
        user: { _id: userId },
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(dto: LoginUserDto): Promise<CreateUserResponseDto> {
    try {
      const { password, confirm_password, email } = dto;

      await validatePasswords(password, confirm_password);

      const existsUser = await this.authRepository.getUserByEmail(email);

      if (!existsUser) {
        throw AuthErrors.InvalidCredentialsError;
      }

      const isComparePasswords = comparePassword(
        password,
        existsUser.password || '',
      );

      if (!isComparePasswords) {
        throw AuthErrors.InvalidCredentialsError;
      }

      const userId: string = existsUser._id || '';
      const tokens = await this.createTokens(userId, existsUser.roles);
      return {
        user: { _id: userId },
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(dto: RefreshTokenDto) {
    try {
      if (!dto.refresh_token) {
        throw AuthErrors.InvalidTokenError;
      }

      await this.authRepository.deleteRefreshToken(dto.refresh_token);

      return { message: LOGOUT_SUCCESS };
    } catch (error) {
      throw error;
    }
  }

  async createTokens(userId: string, roles: AuthRoles[]) {
    try {
      const data = { _id: userId, roles: roles };

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
      throw error;
    }
  }

  async getNewTokens(refreshToken: RefreshTokenDto) {
    try {
      if (!refreshToken.refresh_token) {
        throw AuthErrors.InvalidTokenError;
      }

      const decodedToken = this.jwtService.verify(refreshToken.refresh_token);

      const user = await this.authRepository.getUserById(decodedToken._id);

      if (!user) {
        throw AuthErrors.InvalidTokenError;
      }

      const tokens = await this.createTokens(user._id.toString(), user.roles);

      return {
        user: { _id: user._id },
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }
}
