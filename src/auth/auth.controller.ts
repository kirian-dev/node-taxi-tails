import { CreateUserDto } from './dto/create-user.dto';
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { LOGOUT_SUCCESS } from 'src/common/consts/consts';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: LoginUserDto })
  async signin(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
  @Post('/refresh-token')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'New tokens generated successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: RefreshTokenDto })
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto);
  }
  @Post('/logout')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: LOGOUT_SUCCESS })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: RefreshTokenDto })
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }
}
