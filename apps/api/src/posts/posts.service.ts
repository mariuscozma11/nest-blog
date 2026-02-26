import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from '../common/enums/post-status.enum';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';
import {
  IPostsService,
  PaginatedResult,
  PaginationOptions,
} from './interfaces/posts-service.interface';

@Injectable()
export class PostsService implements IPostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId: author.id,
      status: PostStatus.DRAFT,
    });
    const savedPost = await this.postsRepository.save(post);
    savedPost.author = author;
    return savedPost;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Post>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.postsRepository.findAndCount({
      where: { status: PostStatus.PUBLISHED },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findAllForAdmin(
    options: PaginationOptions,
  ): Promise<PaginatedResult<Post>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.postsRepository.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findMyPosts(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Post>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.postsRepository.findAndCount({
      where: { authorId: userId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string, user?: User | null): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return this.checkReadAccess(post, user);
  }

  async findBySlug(slug: string, user?: User | null): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return this.checkReadAccess(post, user);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOneStrict(id);
    this.checkOwnership(post, user);

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async publish(id: string, user: User): Promise<Post> {
    const post = await this.findOneStrict(id);
    this.checkOwnership(post, user);

    post.status = PostStatus.PUBLISHED;
    post.publishedAt = new Date();
    return this.postsRepository.save(post);
  }

  async archive(id: string, user: User): Promise<Post> {
    const post = await this.findOneStrict(id);
    this.checkOwnership(post, user);

    post.status = PostStatus.ARCHIVED;
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOneStrict(id);
    await this.postsRepository.remove(post);
  }

  private async findOneStrict(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  private checkReadAccess(post: Post, user?: User | null): Post {
    if (!user) {
      if (post.status !== PostStatus.PUBLISHED) {
        throw new NotFoundException(`Post not found`);
      }
      return post;
    }

    if (user.role === Role.ADMIN) {
      return post;
    }

    if (post.authorId === user.id) {
      return post;
    }

    if (post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException(`Post not found`);
    }

    return post;
  }

  private checkOwnership(post: Post, user: User): void {
    if (post.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You can only modify your own posts');
    }
  }
}
