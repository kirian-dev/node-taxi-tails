import { PageMetaDtoParameters } from './pagination.interfaces';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_QUANTITY,
} from 'src/common/consts/consts';

export class PageMetaDto {
  readonly page: number;

  readonly take: number;

  readonly itemCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

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
