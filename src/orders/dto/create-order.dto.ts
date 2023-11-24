import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsObject()
  pickupLocation: {
    coordinates: [number, number];
  };

  @IsNotEmpty()
  @IsObject()
  dropOffLocation: {
    coordinates: [number, number];
  };

  @IsNotEmpty()
  @IsNumber()
  fare: number;
}
