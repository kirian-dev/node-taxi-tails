import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsString()
  driverId?: string;
}
