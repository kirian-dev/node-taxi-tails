import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota', description: 'Car brand' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Camry', description: 'Car model' })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ example: '2015', description: 'Car year' })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({ example: 'ABC123', description: 'Number plate ' })
  @IsNotEmpty()
  @IsString()
  number_plate: string;

  @ApiProperty({ example: 'Blue', description: 'Car color' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ example: 'userId', description: 'User ID' })
  userId: string;
}
