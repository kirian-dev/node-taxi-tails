import { IsNotEmpty, IsString, IsNumber, IsObject } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
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
