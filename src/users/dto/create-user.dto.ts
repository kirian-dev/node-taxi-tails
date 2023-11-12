import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  city: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
  password?: string;

  @IsString()
  @MinLength(6, {
    message: 'Confirm password must be at least 6 characters long',
  })
  @MaxLength(20, {
    message: 'Confirm password cannot be longer than 20 characters',
  })
  confirm_password: string;
}
