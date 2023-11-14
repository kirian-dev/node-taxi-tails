import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({ example: 'user_id', description: 'The user ID' })
  user: {
    _id: string;
  };

  @ApiProperty({ example: 'refresh_token', description: 'The refresh token' })
  refreshToken: string;

  @ApiProperty({ example: 'access_token', description: 'The access token' })
  accessToken: string;
}
