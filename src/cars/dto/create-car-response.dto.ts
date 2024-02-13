import { ApiProperty } from '@nestjs/swagger';
import { CreateCarDto } from './create-car.dto';

export class CreateCarResponseDto extends CreateCarDto {
  @ApiProperty({ example: '_id', description: 'Car ID' })
  _id: string;

  @ApiProperty({
    example: '2023-11-15T12:30:00',
    description: 'Car creation timestamp',
  })
  createdAt: Date;
  updatedAt: Date;
}
