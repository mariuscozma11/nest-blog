import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination.dto';
import { PostResponseDto } from './post-response.dto';
import { Post } from '../entities/post.entity';

export class PaginatedPostsResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  data!: PostResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  static create(
    posts: Post[],
    page: number,
    limit: number,
    totalItems: number,
  ): PaginatedPostsResponseDto {
    const response = new PaginatedPostsResponseDto();
    response.data = PostResponseDto.fromEntities(posts);
    response.meta = PaginationMetaDto.create(page, limit, totalItems);
    return response;
  }
}
