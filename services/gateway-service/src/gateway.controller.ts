import { Controller, Post, Body, HttpCode, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './auth/dto/create-user.dto';

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
}
