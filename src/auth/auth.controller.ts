import { CreateUserDto } from './dto/create-user.dto';
import {
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  @HttpCode(200)
  async signin(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/refresh-token')
  @HttpCode(200)
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/logout')
  @HttpCode(200)
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }
}
