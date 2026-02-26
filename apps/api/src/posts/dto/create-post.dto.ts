import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Blog Post', minLength: 3 })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({
    example: 'This is the content of my blog post...',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  content!: string;

  @ApiPropertyOptional({ example: 'my-first-blog-post' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'A brief summary of the post' })
  @IsString()
  @IsOptional()
  excerpt?: string;
}
