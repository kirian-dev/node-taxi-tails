export interface PaginationOptions {
  page: number;
  limit: number;
}

export class PaginationService {
  static paginate<T>(items: T[], options: PaginationOptions): T[] {
    const { page, limit } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return items.slice(startIndex, endIndex);
  }
}
