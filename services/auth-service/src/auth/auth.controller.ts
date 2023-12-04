import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Body, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @MessagePattern({ cmd: 'register' })
  @HttpCode(201)
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
  @Post('/login')
  @MessagePattern({ cmd: 'login' })
  @HttpCode(200)
  async signin(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
  @Post('/refresh-token')
  @MessagePattern({ cmd: 'refresh-token' })
  @HttpCode(200)
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto);
  }
  @Post('/logout')
  @MessagePattern({ cmd: 'logout' })
  @HttpCode(200)
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }
}
