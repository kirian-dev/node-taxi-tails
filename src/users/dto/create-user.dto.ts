import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ example: 'John', description: 'User first name' })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  last_name: string;

  @IsEmail()
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty({ message: 'Phone number is required' })
  @ApiProperty({ example: '1234567890', description: 'User phone number' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @ApiProperty({ example: 'Cityville', description: 'User city' })
  city: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password cannot be longer than 32 characters' })
  @IsOptional()
  @ApiProperty({
    example: 'password123',
    description: 'User password (optional)',
  })
  password?: string;

  @IsString()
  @MinLength(6, {
    message: 'Confirm password must be at least 6 characters long',
  })
  @MaxLength(32, {
    message: 'Confirm password cannot be longer than 32 characters',
  })
  @IsOptional()
  @ApiProperty({
    example: 'password123',
    description: 'User password confirmation',
  })
  confirm_password: string;
}
