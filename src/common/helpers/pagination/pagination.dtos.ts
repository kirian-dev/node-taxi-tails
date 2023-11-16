import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_QUANTITY,
} from '../../consts/consts';

import { Order } from 'src/common/enums/system.enum';

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = DEFAULT_ITEMS_PER_PAGE;

  get skip(): number {
    return (
      (this.page || DEFAULT_PAGE_QUANTITY) *
      (this.take || DEFAULT_ITEMS_PER_PAGE)
    );
  }
}
