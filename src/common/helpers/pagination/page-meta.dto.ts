import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from './pagination.interfaces';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_QUANTITY,
} from 'src/common/consts/consts';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page || DEFAULT_PAGE_QUANTITY;
    this.take = pageOptionsDto.take || DEFAULT_ITEMS_PER_PAGE;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
