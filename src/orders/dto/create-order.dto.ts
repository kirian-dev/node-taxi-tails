import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  IsArray,
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

  @IsArray()
  @IsNotEmpty()
  @Type(() => Array)
  dropOffLocations: [number, number][];

  @IsNotEmpty()
  @IsNumber()
  fare: number;
}
