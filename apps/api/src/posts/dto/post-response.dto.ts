import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../../common/enums/post-status.enum';
import { Post } from '../entities/post.entity';

export class PostAuthorDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  name!: string | null;
}

export class PostResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'My First Blog Post' })
  title!: string;

  @ApiProperty({ example: 'This is the content of my blog post...' })
  content!: string;

  @ApiProperty({ example: 'my-first-blog-post' })
  slug!: string;

  @ApiPropertyOptional({
    example: 'A brief summary of the post',
    nullable: true,
  })
  excerpt!: string | null;

  @ApiProperty({ enum: PostStatus, example: PostStatus.DRAFT })
  status!: PostStatus;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: PostAuthorDto })
  author!: PostAuthorDto;

  static fromEntity(post: Post): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.slug = post.slug;
    dto.excerpt = post.excerpt;
    dto.status = post.status;
    dto.publishedAt = post.publishedAt;
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    dto.author = {
      id: post.author.id,
      email: post.author.email,
      name: post.author.name,
    };
    return dto;
  }

  static fromEntities(posts: Post[]): PostResponseDto[] {
    return posts.map((post) => PostResponseDto.fromEntity(post));
  }
}
