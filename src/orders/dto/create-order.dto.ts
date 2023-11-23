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
  pickupLocation: { latitude: number; longitude: number };

  @IsNotEmpty()
  @IsObject()
  dropOffLocation: { latitude: number; longitude: number };

  @IsNotEmpty()
  @IsNumber()
  fare: number;
}
