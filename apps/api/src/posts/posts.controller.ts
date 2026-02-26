import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PaginatedPostsResponseDto } from './dto/paginated-posts-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published posts (public, paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of published posts',
    type: PaginatedPostsResponseDto,
  })
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedPostsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.postsService.findAll({ page, limit });
    return PaginatedPostsResponseDto.create(
      result.data,
      page,
      limit,
      result.total,
    );
  }

  @Get('slug/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get post by slug (public for published posts)' })
  @ApiParam({ name: 'slug', description: 'Post slug' })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async findBySlug(
    @Param('slug') slug: string,
    @CurrentUser() user: User | null,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.findBySlug(slug, user);
    return PostResponseDto.fromEntity(post);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all posts including drafts (Admin only, paginated)',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of all posts',
    type: PaginatedPostsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin only' })
  async findAllAdmin(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedPostsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.postsService.findAllForAdmin({ page, limit });
    return PaginatedPostsResponseDto.create(
      result.data,
      page,
      limit,
      result.total,
    );
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my posts (all statuses, paginated)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of user posts',
    type: PaginatedPostsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findMyPosts(
    @CurrentUser() user: User,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedPostsResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const result = await this.postsService.findMyPosts(user.id, {
      page,
      limit,
    });
    return PaginatedPostsResponseDto.create(
      result.data,
      page,
      limit,
      result.total,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get post by ID (public for published posts)' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({
    status: 200,
    description: 'Post found',
    type: PostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User | null,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.findOne(id, user);
    return PostResponseDto.fromEntity(post);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new post (as draft)' })
  @ApiResponse({
    status: 201,
    description: 'Post created',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: User,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.create(createPostDto, user);
    return PostResponseDto.fromEntity(post);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({
    status: 200,
    description: 'Post updated',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Not owner' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.update(id, updatePostDto, user);
    return PostResponseDto.fromEntity(post);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish post (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({
    status: 200,
    description: 'Post published',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Not owner' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.publish(id, user);
    return PostResponseDto.fromEntity(post);
  }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive post (Owner or Admin)' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({
    status: 200,
    description: 'Post archived',
    type: PostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Not owner' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async archive(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.archive(id, user);
    return PostResponseDto.fromEntity(post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post (Admin only)' })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin only' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.postsService.remove(id);
  }
}
