import { Controller, Post, Body, HttpCode, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { LoginUserDto } from './auth/dto/login-user.dto';
import { RefreshTokenDto } from './auth/dto/refresh-token.dto';

@Controller('auth')
export class GatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientAuth: ClientProxy,
  ) {}
  @Post('/register')
  @HttpCode(201)
  async signup(@Body() dto: CreateUserDto) {
    return await this.clientAuth.send({ cmd: 'register' }, dto).toPromise();
  }
  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: LoginUserDto) {
    return await this.clientAuth.send({ cmd: 'login' }, dto).toPromise();
  }
  @Post('/refresh-token')
  @HttpCode(201)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return await this.clientAuth
      .send({ cmd: 'refresh-token' }, dto)
      .toPromise();
  }
  @Post('/logout')
  @HttpCode(201)
  async logout(@Body() dto: RefreshTokenDto) {
    return await this.clientAuth.send({ cmd: 'logout' }, dto).toPromise();
  }
}
