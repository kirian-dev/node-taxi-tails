import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(32)
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  @MaxLength(20)
  @ApiProperty({ example: '1234567890', description: 'User phone number' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ example: 'John', description: 'User first name' })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ example: 'Doe', description: 'User last name' })
  last_name: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @ApiProperty({ example: 'New York', description: 'User city' })
  city: string;

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

  @IsOptional()
  is_verify: boolean;

  @IsOptional()
  verification_code: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Flag indicating whether the user is a driver',
  })
  is_driver?: boolean;
}
