import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Updated Blog Post Title', minLength: 3 })
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated content of my blog post...',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 'updated-blog-post-slug' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Updated brief summary' })
  @IsString()
  @IsOptional()
  excerpt?: string;
}
