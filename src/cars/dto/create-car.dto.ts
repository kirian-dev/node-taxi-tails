import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  year: string;

  @ApiProperty({ example: 'ABC123', description: 'Number plate ' })
  @IsNotEmpty()
  @IsString()
  number_plate: string;

  @ApiProperty({ example: 'Blue', description: 'Car color' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    example: 'https/amazon-s3.test.com',
    description: 'Car photo',
  })
  @IsOptional()
  photoUrl: string;

  @ApiProperty({ example: 'userId', description: 'User ID' })
  userId: string;
}
