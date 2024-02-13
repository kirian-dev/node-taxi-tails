import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(32)
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password cannot be longer than 32 characters' })
  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password cannot be longer than 32 characters' })
  @ApiProperty({
    example: 'password123',
    description: 'Confirmation of the user password',
  })
  confirm_password: string;
}
