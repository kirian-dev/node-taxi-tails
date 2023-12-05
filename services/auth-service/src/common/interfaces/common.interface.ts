import { IsNotEmpty, IsOptional } from 'class-validator';

export class Location {
  @IsOptional()
  type?: string;

  @IsNotEmpty()
  coordinates: [number, number];
}
