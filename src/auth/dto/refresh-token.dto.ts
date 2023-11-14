import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class RefreshTokenDto {
  @IsString()
  @ApiProperty({
    example: 'refreshTokenValue',
    description: 'Refresh token value',
  })
  refresh_token: string;
}
