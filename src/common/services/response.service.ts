import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  formatResponse<T>(
    data: T[],
    hasNext: boolean = false,
  ): { hasNext: boolean; items: T[] } {
    return {
      hasNext,
      items: data,
    };
  }
}
