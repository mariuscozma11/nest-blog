import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 100 })
  totalItems!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage!: boolean;

  static create(
    page: number,
    limit: number,
    totalItems: number,
  ): PaginationMetaDto {
    const meta = new PaginationMetaDto();
    meta.page = page;
    meta.limit = limit;
    meta.totalItems = totalItems;
    meta.totalPages = Math.ceil(totalItems / limit);
    meta.hasNextPage = page < meta.totalPages;
    meta.hasPreviousPage = page > 1;
    return meta;
  }
}

export class PaginatedResponseDto<T> {
  data!: T[];
  meta!: PaginationMetaDto;

  static create<T>(
    data: T[],
    page: number,
    limit: number,
    totalItems: number,
  ): PaginatedResponseDto<T> {
    const response = new PaginatedResponseDto<T>();
    response.data = data;
    response.meta = PaginationMetaDto.create(page, limit, totalItems);
    return response;
  }
}
